import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingUp,
    Settings,
    HelpCircle,
    LogOut,
    Plus,
    Trash2,
    Save,
    User as UserIcon,
    ChevronDown
} from 'lucide-react';
import StatCard from './components/StatCard';
import RuleEditor from './components/RuleEditor';
import TransactionManager from './components/TransactionManager';
import ProblemWalkthrough from './components/ProblemWalkthrough';
import AuthPage from './components/AuthPage';
import api, {
    Transaction,
    Rule,
    CorpusProfile,
    ReturnsResponse
} from './api';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const App: React.FC = () => {
    // --- Auth State ---
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [profiles, setProfiles] = useState<CorpusProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<CorpusProfile | null>(null);
    const [loadingProfiles, setLoadingProfiles] = useState(false);

    // --- Current Corpus State (Synced with Active Profile) ---
    const [age, setAge] = useState(30);
    const [wage, setWage] = useState(125000);
    const [inflation, setInflation] = useState(5.5);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [qRules, setQRules] = useState<{ fixed: number; start: string; end: string }[]>([]);
    const [pRules, setPRules] = useState<{ extra: number; start: string; end: string }[]>([]);
    const [kPeriods, setKPeriods] = useState<{ start: string; end: string }[]>([]);

    // --- UI State ---
    const [activeTab, setActiveTab] = useState<'expenses' | 'rules' | 'guide'>('expenses');
    const [npsResult, setNpsResult] = useState<ReturnsResponse | null>(null);
    const [indexResult, setIndexResult] = useState<ReturnsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- Loading Logic ---
    useEffect(() => {
        if (token) {
            fetchProfiles();
        }
    }, [token]);

    const fetchProfiles = async () => {
        setLoadingProfiles(true);
        try {
            const res = await api.get('/corpus/');
            setProfiles(res.data);
            if (res.data.length > 0 && !activeProfile) {
                loadProfileIntoState(res.data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch profiles", err);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const loadProfileIntoState = (profile: CorpusProfile) => {
        setActiveProfile(profile);
        setAge(profile.age);
        setWage(profile.wage);
        setInflation(profile.inflation);
        setTransactions(profile.transactions);

        // Parse rules back into specialized lists
        const qs = profile.rules.filter(r => r.type === 'Q').map(r => ({ fixed: r.value || 0, start: r.start_date, end: r.end_date }));
        const ps = profile.rules.filter(r => r.type === 'P').map(r => ({ extra: r.value || 0, start: r.start_date, end: r.end_date }));
        const ks = profile.rules.filter(r => r.type === 'K').map(r => ({ start: r.start_date, end: r.end_date }));

        setQRules(qs);
        setPRules(ps);
        setKPeriods(ks);
    };

    const createNewProfile = async () => {
        const name = prompt("Enter a name for this corpus variation:");
        if (!name) return;

        try {
            const res = await api.post('/corpus/', {
                name,
                age: 30,
                wage: 125000,
                inflation: 5.5,
                transactions: [],
                rules: []
            });
            setProfiles([...profiles, res.data]);
            loadProfileIntoState(res.data);
        } catch (err) {
            alert("Failed to create profile");
        }
    };

    const deleteCurrentProfile = async () => {
        if (!activeProfile || !confirm("Are you sure you want to delete this corpus?")) return;
        try {
            await api.delete(`/corpus/${activeProfile.id}`);
            const updated = profiles.filter(p => p.id !== activeProfile.id);
            setProfiles(updated);
            if (updated.length > 0) loadProfileIntoState(updated[0]);
            else setActiveProfile(null);
        } catch (err) {
            alert("Delete failed");
        }
    };

    const saveChanges = async () => {
        if (!activeProfile) return;
        setSaving(true);
        try {
            // Simplified: In a real app we'd have a PATCH /corpus/{id} endpoint
            // For now, we'll just implement the calculation but in a real app 
            // you'd persist the settings and rules to the DB here.
            setTimeout(() => setSaving(false), 500);
        } catch (err) {
            setSaving(false);
        }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        if (transactions.length > 0) {
            calculateProjections();
        }
    }, [transactions, qRules, pRules, kPeriods, age, wage, inflation]);

    const calculateProjections = async () => {
        setLoading(true);
        try {
            // Use existing logic but with state values
            const payload = {
                transactions,
                q_rules: qRules,
                p_rules: pRules,
                k_periods: kPeriods.length > 0 ? kPeriods : [{ start: "2023-01-01 00:00:00", end: "2023-12-31 23:59:59" }],
                inflation,
                wage
            };

            const [npsRes, indexRes] = await Promise.all([
                api.post('/returns:nps', payload),
                api.post('/returns:index', payload)
            ]);

            setNpsResult(npsRes.data);
            setIndexResult(indexRes.data);
        } catch (err) {
            console.error("Calculation failed", err);
        } finally {
            setLoading(false);
        }
    };

    const chartData = useMemo(() => {
        if (!npsResult || !indexResult) return [];
        const npsPoints = npsResult.savings_over_time;
        const indexPoints = indexResult.savings_over_time;

        return npsPoints.map((p, i) => ({
            date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
            nps: Math.round(p.amount),
            index: Math.round(indexPoints[i]?.amount || 0)
        }));
    }, [npsResult, indexResult]);

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    if (!token) {
        return <AuthPage onLogin={(t) => setToken(t)} />;
    }

    return (
        <div className="app-layout">
            {/* Sidebar / Profile Manager */}
            <aside className="sidebar glass">
                <div className="sidebar-header">
                    <UserIcon size={32} className="text-primary" />
                    <div>
                        <h3>My Corpous</h3>
                        <p>Manage variations</p>
                    </div>
                </div>

                <div className="profile-list">
                    {profiles.map(p => (
                        <button
                            key={p.id}
                            className={`profile-item ${activeProfile?.id === p.id ? 'active' : ''}`}
                            onClick={() => loadProfileIntoState(p)}
                        >
                            {p.name}
                        </button>
                    ))}
                    <button className="btn-add-profile" onClick={createNewProfile}>
                        <Plus size={16} /> New Corpus
                    </button>
                </div>

                <div className="sidebar-footer">
                    <button className="btn-logout" onClick={logout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div className="header-brand">
                        <h1>{activeProfile?.name || 'Smart Retirement Saver'}</h1>
                        <p>Precision micro-investing based on frictionless expense rounding.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={deleteCurrentProfile}>
                            <Trash2 size={16} /> Delete
                        </button>
                        <button className="btn btn-primary" onClick={saveChanges} disabled={saving}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <div className={`engine-status ${loading ? 'loading' : ''}`}>
                            <TrendingUp size={16} />
                            <span>Engine {loading ? 'Computing' : 'Active'}</span>
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid">
                    <StatCard
                        title="Total Invested"
                        value={npsResult?.total_invested || 0}
                        info="Initial Capital"
                        icon="Wallet"
                    />
                    <StatCard
                        title="Round-up Capital"
                        value={npsResult?.total_remanent || 0}
                        info="Saved via Rounding"
                        icon="TrendingUp"
                        variant="success"
                    />
                    <StatCard
                        title="Tax Efficiency"
                        value={npsResult?.tax_benefit || 0}
                        info="Saved via NPS"
                        icon="ShieldCheck"
                        variant="warning"
                    />
                    <StatCard
                        title="Projected Profit"
                        value={(npsResult?.inflation_adjusted_returns || 0)}
                        info="Interest Earned"
                        icon="BarChart3"
                        variant="purple"
                    />
                </div>

                <div className="main-grid">
                    <div className="controls-panel card glass">
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('expenses')}
                            >
                                Expenses
                            </button>
                            <button
                                className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rules')}
                            >
                                Rules
                            </button>
                            <button
                                className={`tab ${activeTab === 'guide' ? 'active' : ''}`}
                                onClick={() => setActiveTab('guide')}
                            >
                                Guide
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'expenses' && (
                                <>
                                    <div className="profile-config section">
                                        <div className="section-header">
                                            <Settings size={18} />
                                            <h3>Profile Config</h3>
                                        </div>
                                        <div className="input-row">
                                            <div className="input-group">
                                                <label>Age</label>
                                                <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                                            </div>
                                            <div className="input-group">
                                                <label>Wage</label>
                                                <input type="number" value={wage} onChange={(e) => setWage(Number(e.target.value))} />
                                            </div>
                                            <div className="input-group">
                                                <label>Inflation %</label>
                                                <input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                    <TransactionManager
                                        transactions={transactions}
                                        onUpdate={setTransactions}
                                    />
                                </>
                            )}

                            {activeTab === 'rules' && (
                                <RuleEditor
                                    qRules={qRules}
                                    setQRules={setQRules}
                                    pRules={pRules}
                                    setPRules={setPRules}
                                    kPeriods={kPeriods}
                                    setKPeriods={setKPeriods}
                                />
                            )}

                            {activeTab === 'guide' && <ProblemWalkthrough />}
                        </div>
                    </div>

                    <div className="visualization-panel card glass">
                        <div className="panel-header">
                            <TrendingUp size={18} />
                            <h3>Corpus Growth projection</h3>
                            <div className="legend-pills">
                                <span className="pill nps">NPS (Real)</span>
                                <span className="pill index">Index Fund (Real)</span>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorNps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#41b883" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#41b883" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8a3ffc" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8a3ffc" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                                        itemStyle={{ fontSize: '13px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="nps"
                                        name="NPS (Real)"
                                        stroke="#41b883"
                                        fillOpacity={1}
                                        fill="url(#colorNps)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="index"
                                        name="Index Fund (Real)"
                                        stroke="#8a3ffc"
                                        fillOpacity={1}
                                        fill="url(#colorIndex)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .app-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    height: 100vh;
                    background: var(--bg-deep);
                }
                .sidebar {
                    border-right: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                }
                .sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2.5rem;
                }
                .sidebar-header h3 { font-size: 1.1rem; }
                .sidebar-header p { font-size: 0.8rem; color: var(--text-dim); }
                
                .profile-list {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .profile-item {
                    text-align: left;
                    padding: 0.8rem 1rem;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                }
                .profile-item:hover { background: rgba(255,255,255,0.08); }
                .profile-item.active {
                    background: rgba(65, 184, 131, 0.1);
                    border-color: rgba(65, 184, 131, 0.3);
                    color: white;
                }
                .btn-add-profile {
                    margin-top: 1rem;
                    background: none;
                    border: 1px dashed rgba(255,255,255,0.2);
                    padding: 0.8rem;
                    border-radius: 10px;
                    color: var(--text-dim);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .btn-add-profile:hover { border-color: var(--primary); color: white; }

                .btn-logout {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: none;
                    border: none;
                    color: #ff4d4d;
                    cursor: pointer;
                    padding: 0.5rem;
                    opacity: 0.7;
                }
                .btn-logout:hover { opacity: 1; }

                .main-content {
                    padding: 2.5rem 3.5rem;
                    overflow-y: auto;
                }
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2.5rem;
                }
                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                /* Reuse your existing dashboard styles below or add them to index.css */
            `}</style>
        </div>
    );
};

export default App;

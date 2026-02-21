import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    Wallet,
    Plus,
    Activity,
    User,
    ShieldCheck,
    BarChart3,
    CalendarDays,
    Percent,
    Timer
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import { Transaction, QRule, PRule, KPeriod, ReturnsResponse, ReturnsRequest, api } from './api';
import { StatCard } from './components/StatCard';
import { TransactionManager } from './components/TransactionManager';
import { RuleEditor } from './components/RuleEditor';
import { ProblemWalkthrough } from './components/ProblemWalkthrough';

const App: React.FC = () => {
    // --- State ---
    const [age, setAge] = useState(30);
    const [wage, setWage] = useState(125000); // Higher wage to show tax benefits
    const [inflation, setInflation] = useState(5.5);
    const [transactions, setTransactions] = useState<Transaction[]>([
        { date: "2023-01-15 10:00:00", amount: 250 },
        { date: "2023-02-12 14:30:00", amount: 1890 },
        { date: "2023-03-05 19:15:00", amount: 45 },
        { date: "2023-04-20 11:00:00", amount: 720 },
        { date: "2023-05-10 09:30:00", amount: 1560 },
        { date: "2023-06-25 18:45:00", amount: 310 },
        { date: "2023-07-14 13:20:00", amount: 880 },
        { date: "2023-08-08 16:10:00", amount: 2450 },
        { date: "2023-09-30 20:05:00", amount: 120 },
        { date: "2023-10-12 11:30:00", amount: 560 },
        { date: "2023-11-22 15:40:00", amount: 930 },
        { date: "2023-12-28 12:00:00", amount: 410 },
    ]);
    const [qRules, setQRules] = useState<QRule[]>([
        { fixed: 500, start: "2023-02-01 00:00:00", end: "2023-02-28 23:59:59" } // Override Feb
    ]);
    const [pRules, setPRules] = useState<PRule[]>([
        { extra: 100, start: "2023-10-01 00:00:00", end: "2023-12-31 23:59:59" } // Addition in Q4
    ]);
    const [kPeriods, setKPeriods] = useState<KPeriod[]>([
        { start: "2023-01-01 00:00:00", end: "2023-03-31 23:59:59" },
        { start: "2023-04-01 00:00:00", end: "2023-06-30 23:59:59" },
        { start: "2023-07-01 00:00:00", end: "2023-09-30 23:59:59" },
        { start: "2023-10-01 00:00:00", end: "2023-12-31 23:59:59" },
    ]);
    const [npsResult, setNpsResult] = useState<ReturnsResponse | null>(null);
    const [indexResult, setIndexResult] = useState<ReturnsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'inputs' | 'rules' | 'walkthrough'>('inputs');

    // --- Effects ---
    useEffect(() => {
        handleCalculate();
    }, []);

    // --- Handlers ---
    const handleCalculate = async () => {
        setLoading(true);
        const request: ReturnsRequest = {
            age,
            wage,
            inflation,
            q: qRules,
            p: pRules,
            k: kPeriods,
            transactions
        };

        try {
            const [npsRes, indexRes] = await Promise.all([
                api.post<ReturnsResponse>('/returns:nps', request),
                api.post<ReturnsResponse>('/returns:index', request),
            ]);
            setNpsResult(npsRes.data);
            setIndexResult(indexRes.data);
        } catch (err) {
            console.error("Calculation failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const updateRule = (type: 'Q' | 'P' | 'K', index: number, field: string, value: any) => {
        if (type === 'Q') {
            const newRules = [...qRules];
            newRules[index] = { ...newRules[index], [field]: value };
            setQRules(newRules);
        } else if (type === 'P') {
            const newRules = [...pRules];
            newRules[index] = { ...newRules[index], [field]: value };
            setPRules(newRules);
        } else {
            const newRules = [...kPeriods];
            newRules[index] = { ...newRules[index], [field]: value };
            setKPeriods(newRules);
        }
    };

    // --- Derived Data ---
    const totalRoundUp = npsResult?.savingByDates.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const totalTaxBenefit = npsResult?.savingByDates.reduce((acc, curr) => acc + curr.taxBenefit, 0) || 0;
    const totalProfit = npsResult?.savingByDates.reduce((acc, curr) => acc + curr.profit, 0) || 0;

    const chartData = npsResult?.savingByDates.map((item, i) => ({
        name: `Period ${i + 1}`,
        NPS: parseFloat((item.amount + item.profit + item.taxBenefit).toFixed(2)),
        Index: parseFloat(((indexResult?.savingByDates[i].amount ?? 0) + (indexResult?.savingByDates[i].profit ?? 0)).toFixed(2)),
        Invested: item.amount
    })) || [];

    return (
        <div className="fade-in">
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1>Smart Retirement Saver</h1>
                    <p className="subtitle">Precision micro-investing based on frictionless expense rounding.</p>
                </div>
                <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Activity size={20} color="var(--success-color)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Engine Active</span>
                </div>
            </header>

            {/* Main Stats Grid */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <StatCard
                    title="Total Invested"
                    value={`₹${npsResult?.totalTranscationAmount?.toLocaleString() || '0'}`}
                    icon={Wallet}
                    color="var(--accent-color)"
                    subValue="Initial Capital"
                />
                <StatCard
                    title="Round-up Capital"
                    value={`₹${totalRoundUp.toLocaleString()}`}
                    icon={TrendingUp}
                    color="var(--success-color)"
                    subValue="Saved via Rounding"
                />
                <StatCard
                    title="Tax Efficiency"
                    value={`₹${totalTaxBenefit.toLocaleString()}`}
                    icon={ShieldCheck}
                    color="var(--warning-color)"
                    subValue="Saved via NPS"
                />
                <StatCard
                    title="Projected Profit"
                    value={`₹${totalProfit.toLocaleString()}`}
                    icon={BarChart3}
                    color="#a855f7"
                    subValue="Interest Earned"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 2fr', gap: '2.5rem' }}>
                {/* Work Area */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Tabs */}
                    <div className="glass" style={{ padding: '0.4rem', display: 'flex', gap: '0.4rem' }}>
                        <button
                            className={`btn ${activeTab === 'inputs' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.5rem' }}
                            onClick={() => setActiveTab('inputs')}
                        >
                            Expenses
                        </button>
                        <button
                            className={`btn ${activeTab === 'rules' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.5rem' }}
                            onClick={() => setActiveTab('rules')}
                        >
                            Rules
                        </button>
                        <button
                            className={`btn ${activeTab === 'walkthrough' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.5rem' }}
                            onClick={() => setActiveTab('walkthrough')}
                        >
                            Guide
                        </button>
                    </div>

                    <div style={{ minHeight: '600px' }}>
                        {activeTab === 'inputs' && (
                            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="glass" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <User size={20} color="var(--accent-color)" />
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile Config</h2>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Age</label>
                                            <input className="input-field" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Wage</label>
                                            <input className="input-field" type="number" value={wage} onChange={(e) => setWage(Number(e.target.value))} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Inflation %</label>
                                            <input className="input-field" type="number" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                <TransactionManager
                                    transactions={transactions}
                                    onAdd={() => setTransactions([...transactions, { date: "2023-01-01 12:00:00", amount: 0 }])}
                                    onUpdate={(idx, f, v) => {
                                        const next = [...transactions];
                                        next[idx] = { ...next[idx], [f]: f === 'amount' ? Number(v) : v };
                                        setTransactions(next);
                                    }}
                                    onRemove={(idx) => setTransactions(transactions.filter((_, i) => i !== idx))}
                                />
                            </div>
                        )}

                        {activeTab === 'rules' && (
                            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <RuleEditor
                                    title="Q Rules (Override)"
                                    description="Fixed investment amount during specified periods."
                                    rules={qRules}
                                    type="Q"
                                    onAdd={() => setQRules([...qRules, { fixed: 0, start: "2023-01-01 00:00:00", end: "2023-12-31 23:59:59" }])}
                                    onUpdate={(idx, f, v) => updateRule('Q', idx, f, v)}
                                    onRemove={(idx) => setQRules(qRules.filter((_, i) => i !== idx))}
                                />
                                <RuleEditor
                                    title="P Rules (Addition)"
                                    description="Extra investment amount added to the remanent."
                                    rules={pRules}
                                    type="P"
                                    onAdd={() => setPRules([...pRules, { extra: 0, start: "2023-01-01 00:00:00", end: "2023-12-31 23:59:59" }])}
                                    onUpdate={(idx, f, v) => updateRule('P', idx, f, v)}
                                    onRemove={(idx) => setPRules(pRules.filter((_, i) => i !== idx))}
                                />
                                <RuleEditor
                                    title="K Periods (Evaluation)"
                                    description="Specify timeframes for performance calculation."
                                    rules={kPeriods}
                                    type="K"
                                    onAdd={() => setKPeriods([...kPeriods, { start: "2023-01-01 00:00:00", end: "2023-12-31 23:59:59" }])}
                                    onUpdate={(idx, f, v) => updateRule('K', idx, f, v)}
                                    onRemove={(idx) => setKPeriods(kPeriods.filter((_, i) => i !== idx))}
                                />
                            </div>
                        )}

                        {activeTab === 'walkthrough' && <ProblemWalkthrough />}
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: 'auto' }}
                        onClick={handleCalculate}
                        disabled={loading}
                    >
                        {loading ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Timer size={18} className="spin" /> Calculating...</div> : 'Sync with Backend'}
                    </button>
                </section>

                {/* Visualizations */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Main Chart */}
                    <div className="glass" style={{ padding: '2rem', height: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <TrendingUp size={22} color="var(--success-color)" />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Corpus Growth projection</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--accent-color)' }} /> NPS (Real)
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '2px', background: 'var(--success-color)' }} /> Index Fund (Real)
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorNps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--success-color)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--success-color)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '0.75rem', outline: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ fontSize: '0.85rem', padding: '2px 0' }}
                                    labelStyle={{ marginBottom: '0.5rem', fontWeight: 700, color: 'white' }}
                                />
                                <Area type="monotone" dataKey="NPS" stroke="var(--accent-color)" fillOpacity={1} fill="url(#colorNps)" strokeWidth={3} animationDuration={1500} />
                                <Area type="monotone" dataKey="Index" stroke="var(--success-color)" fillOpacity={1} fill="url(#colorIndex)" strokeWidth={3} animationDuration={1500} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Info Panels */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Percent size={18} color="var(--accent-color)" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Inflation Adjusted</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                The projections above already account for <strong>{inflation}% annual inflation</strong>.
                                Values shown represent the equivalent purchasing power in today's currency.
                            </p>
                        </div>
                        <div className="glass" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <Timer size={18} color="var(--success-color)" />
                                <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Power of Compounding</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                Small round-ups grow exponentially. Over <strong>{60 - age} years</strong>,
                                your frictionless savings could build a significant corpus with zero manual effort.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <ShieldCheck size={16} /> Precision Math
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Activity size={16} /> Real-time Simulation
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <TrendingUp size={16} /> Smart Portfolio
                    </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                    © 2024 Smart Retirement Saver | Blackrock Hackathon Entry
                </p>
            </footer>

            {/* Inline Styles for Inputs */}
            <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--card-border);
          border-radius: 0.5rem;
          color: white;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--accent-color);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default App;

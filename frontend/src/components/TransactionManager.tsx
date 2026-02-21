import React from 'react';
import { Plus, Trash2, Wallet, Calendar, Hash } from 'lucide-react';
import { Transaction } from '../api';

interface TransactionManagerProps {
    transactions: Transaction[];
    onAdd: () => void;
    onUpdate: (index: number, field: keyof Transaction, value: any) => void;
    onRemove: (index: number) => void;
}

export const TransactionManager: React.FC<TransactionManagerProps> = ({
    transactions,
    onAdd,
    onUpdate,
    onRemove,
}) => {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Wallet size={20} color="var(--accent-color)" />
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Micro-Transactions</h2>
                </div>
                <button className="btn btn-secondary" onClick={onAdd} style={{ padding: '0.4rem' }}>
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '430px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {transactions.map((tx, idx) => (
                    <div key={idx} className="glass" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', display: 'grid', gridTemplateColumns: '1fr 1.5fr 40px', gap: '1rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Amount</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    value={tx.amount}
                                    onChange={(e) => onUpdate(idx, 'amount', e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.75rem', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '0.3rem', color: 'white', fontSize: '0.8rem' }}
                                />
                                <Hash size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Date</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={tx.date}
                                    onChange={(e) => onUpdate(idx, 'date', e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.75rem', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: '0.3rem', color: 'white', fontSize: '0.8rem' }}
                                />
                                <Calendar size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                        <button onClick={() => onRemove(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '0.5rem' }}>
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {transactions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        No transactions added yet. Click + to add your first expense.
                    </div>
                )}
            </div>
        </div>
    );
};

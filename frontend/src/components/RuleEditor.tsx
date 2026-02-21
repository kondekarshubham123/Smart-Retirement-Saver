import React from 'react';
import { Plus, Trash2, Calendar, Hash } from 'lucide-react';

interface Rule {
    start: string;
    end: string;
    fixed?: number;
    extra?: number;
}

interface RuleEditorProps {
    title: string;
    description: string;
    rules: Rule[];
    onAdd: () => void;
    onUpdate: (index: number, field: string, value: any) => void;
    onRemove: (index: number) => void;
    type: 'Q' | 'P' | 'K';
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
    title,
    description,
    rules,
    onAdd,
    onUpdate,
    onRemove,
    type
}) => {
    return (
        <div className="glass" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
                <button className="btn btn-secondary" onClick={onAdd} style={{ padding: '0.4rem' }}>
                    <Plus size={16} />
                </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rules.map((rule, idx) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 40px', gap: '0.75rem', alignItems: 'end' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Start Date</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={rule.start}
                                    onChange={(e) => onUpdate(idx, 'start', e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '0.4rem', color: 'white', fontSize: '0.75rem' }}
                                />
                                <Calendar size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>End Date</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={rule.end}
                                    onChange={(e) => onUpdate(idx, 'end', e.target.value)}
                                    style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '0.4rem', color: 'white', fontSize: '0.75rem' }}
                                />
                                <Calendar size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                        {type !== 'K' && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.6rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{type === 'Q' ? 'Fixed (Override)' : 'Extra (Addition)'}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        value={type === 'Q' ? rule.fixed : rule.extra}
                                        onChange={(e) => onUpdate(idx, type === 'Q' ? 'fixed' : 'extra', Number(e.target.value))}
                                        style={{ width: '100%', padding: '0.5rem 0.5rem 0.5rem 1.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '0.4rem', color: 'white', fontSize: '0.75rem' }}
                                    />
                                    <Hash size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                </div>
                            </div>
                        )}
                        <button onClick={() => onRemove(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '0.5rem' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

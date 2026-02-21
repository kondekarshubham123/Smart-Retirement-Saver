import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    subValue?: string;
    icon: LucideIcon;
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, icon: Icon, color = 'var(--accent-color)' }) => {
    return (
        <div className="glass" style={{ padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{title}</span>
                <Icon size={18} color={color} />
            </div>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</p>
            {subValue && <span style={{ fontSize: '0.75rem', color: color, fontWeight: 500 }}>{subValue}</span>}
        </div>
    );
};

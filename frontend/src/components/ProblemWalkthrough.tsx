import React from 'react';
import { Info, HelpCircle, ArrowRight, CornerDownRight } from 'lucide-react';

export const ProblemWalkthrough: React.FC = () => {
    return (
        <div className="glass walkthrough-container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <HelpCircle size={24} color="var(--accent-color)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Understanding the Micro-Investment Logic</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ borderLeft: '2px solid var(--accent-color)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '2px 8px', background: 'var(--accent-color)', borderRadius: '4px', color: 'white', fontSize: '0.7rem' }}>STEP 1</div>
                        The Round-Up Rule
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Every expense you track is automatically rounded up to the next <strong>multiple of 100</strong>.
                        The difference (Remanent) is your investment seed.
                    </p>
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.5rem', color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CornerDownRight size={14} /> Example: A ₹250 meal rounds to ₹300. Remanent = ₹50.
                    </div>
                </div>

                <div style={{ borderLeft: '2px solid var(--warning-color)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '2px 8px', background: 'var(--warning-color)', borderRadius: '4px', color: 'white', fontSize: '0.7rem' }}>STEP 2</div>
                        Q-Period Override (Precedence 1)
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        During a Q period, we ignore the round-up remanent and use a <strong>fixed amount</strong> instead.
                        If multiple Q periods overlap, the one that started latest takes priority.
                    </p>
                </div>

                <div style={{ borderLeft: '2px solid var(--success-color)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '2px 8px', background: 'var(--success-color)', borderRadius: '4px', color: 'white', fontSize: '0.7rem' }}>STEP 3</div>
                        P-Period Extra (Precedence 2)
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        P rules <strong>add</strong> an extra amount to your remanent (even if it was already overridden by a Q rule).
                        All matching P rules are summed together.
                    </p>
                </div>

                <div style={{ borderLeft: '2px solid var(--text-secondary)', paddingLeft: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ padding: '2px 8px', background: 'var(--text-secondary)', borderRadius: '4px', color: 'white', fontSize: '0.7rem' }}>STEP 4</div>
                        K-Period Evaluation
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Finally, your portfolio is evaluated over specific K periods. We calculate the <strong>Real Internal Rate of Return</strong>
                        after adjusting for inflation and applying tax benefits.
                    </p>
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .walkthrough-container {
                        padding: 1rem !important;
                    }
                    .walkthrough-container h2 {
                        font-size: 1.1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

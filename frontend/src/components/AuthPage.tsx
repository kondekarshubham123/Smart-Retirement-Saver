import React, { useState } from 'react';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import api from '../api';

interface AuthPageProps {
    onLogin: (token: str) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/signup';
            const response = await api.post(endpoint, { username, password });
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            onLogin(access_token);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <div className="auth-header">
                    <ShieldCheck className="auth-logo" size={48} />
                    <h1>Smart Retirement Saver</h1>
                    <p>{isLogin ? 'Welcome back! Sign in to view your corpous.' : 'Create an account to start saving.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Sign Up</>)}
                    </button>
                </form>

                <div className="auth-footer">
                    <button onClick={() => setIsLogin(!isLogin)} className="btn-link">
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>

            <style>{`
        .auth-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-deep);
        }
        .auth-card {
          width: 400px;
          padding: 2.5rem;
          border-radius: 20px;
          text-align: center;
        }
        .auth-logo {
          color: var(--primary);
          margin-bottom: 1rem;
        }
        .auth-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .auth-header p {
          color: var(--text-dim);
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }
        .auth-form {
          text-align: left;
        }
        .input-group {
          margin-bottom: 1.5rem;
        }
        .input-group label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-dim);
          margin-bottom: 0.5rem;
        }
        .input-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: white;
          outline: none;
        }
        .input-group input:focus {
          border-color: var(--primary);
        }
        .auth-error {
          color: #ff4d4d;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          background: rgba(255, 77, 77, 0.1);
          padding: 0.5rem;
          border-radius: 5px;
          text-align: center;
        }
        .btn-link {
          background: none;
          border: none;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 1.5rem;
        }
        .btn-block {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
      `}</style>
        </div>
    );
};

export default AuthPage;

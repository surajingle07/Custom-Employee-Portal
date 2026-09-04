import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cloud, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

const Login = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const demoAccounts = [
    { role: 'Admin', email: 'admin@company.com', pass: 'Password123!', badge: 'badge-admin', app: 'All Zoho Apps' },
    { role: 'HR', email: 'hr@company.com', pass: 'Password123!', badge: 'badge-hr', app: 'Zoho People' },
    { role: 'Sales', email: 'sales@company.com', pass: 'Password123!', badge: 'badge-sales', app: 'Zoho CRM' },
    { role: 'Support', email: 'support@company.com', pass: 'Password123!', badge: 'badge-support', app: 'Zoho Desk' },
    { role: 'Finance', email: 'finance@company.com', pass: 'Password123!', badge: 'badge-finance', app: 'Zoho Books' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  const handleQuickLogin = (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    login(acc.email, acc.pass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px' }}>
            <Cloud size={28} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '6px' }}>Enterprise Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Zoho One RBAC Authentication Engine</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Work Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="employee@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Portal Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            <UserCheck size={14} />
            <span>Instant Role Simulation (1-Click Demo)</span>
          </div>

          <div className="quick-login-grid">
            {demoAccounts.map((acc) => (
              <div key={acc.role} className="quick-login-card" onClick={() => handleQuickLogin(acc)}>
                <span className={`user-badge ${acc.badge}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                  {acc.role}
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {acc.app}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

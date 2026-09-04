import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ZohoAppModal from '../components/ZohoAppModal';
import { ShieldCheck, Lock, ExternalLink, Users, TrendingUp, HelpCircle, DollarSign, Cloud, Sparkles, CheckCircle2 } from 'lucide-react';

const allZohoApps = [
  { key: 'people', name: 'Zoho People', category: 'Human Resources & Attendance', icon: Users, url: 'https://people.zoho.com', requiredRole: 'HR' },
  { key: 'crm', name: 'Zoho CRM', category: 'Sales & Customer Relationships', icon: TrendingUp, url: 'https://crm.zoho.com', requiredRole: 'Sales' },
  { key: 'desk', name: 'Zoho Desk', category: 'Support Tickets & Helpdesk', icon: HelpCircle, url: 'https://desk.zoho.com', requiredRole: 'Support' },
  { key: 'books', name: 'Zoho Books', category: 'Finance & Invoicing Engine', icon: DollarSign, url: 'https://books.zoho.com', requiredRole: 'Finance' }
];

const Dashboard = () => {
  const { user, isAdmin, hasAppAccess } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null);

  if (!user) return null;

  const roleName = user.role || user.roleName || 'Employee';
  const authorizedApps = allZohoApps.filter(app => hasAppAccess(app.key));
  const restrictedApps = allZohoApps.filter(app => !hasAppAccess(app.key));

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.9), rgba(15, 23, 42, 0.95))',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--primary-accent)' }}>
            <Sparkles size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SINGLE SERVICE ACCOUNT INTEGRATION
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px' }}>
            Welcome back, {user.name}
          </h1>

          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', fontSize: '0.95rem' }}>
            Your portal account is assigned the <strong style={{ color: 'var(--text-main)' }}>{roleName}</strong> role. Access to connected Zoho One services is automatically restricted by Role-Based Access Control (RBAC). No personal Zoho credentials required.
          </p>
        </div>
      </div>

      {/* Authorized Services Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <CheckCircle2 size={22} style={{ color: 'var(--emerald-accent)' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Permitted Zoho Services</h2>
          <span className="user-badge badge-hr" style={{ marginLeft: 'auto' }}>
            {authorizedApps.length} Service{authorizedApps.length > 1 ? 's' : ''} Authorized
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {authorizedApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <div key={app.key} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: 'var(--primary-accent)',
                      border: '1px solid var(--border-accent)'
                    }}>
                      <IconComponent size={24} />
                    </div>
                    <span className="user-badge badge-support">Authorized</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{app.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>{app.category}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedApp(app)}
                  >
                    <span>Inspect Data</span>
                  </button>
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    title="Launch directly in browser"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restricted Services Section (RBAC Enforcement Visualizer) */}
      {!isAdmin && restrictedApps.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Lock size={20} style={{ color: 'var(--rose-accent)' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Restricted Services (RBAC Protection Enforced)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {restrictedApps.map((app) => {
              const IconComponent = app.icon;
              return (
                <div key={app.key} className="glass-card" style={{ opacity: 0.5, filter: 'grayscale(0.6)', cursor: 'not-allowed' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)' }}>
                      <IconComponent size={24} />
                    </div>
                    <span className="user-badge badge-finance" style={{ opacity: 0.8 }}>
                      <Lock size={10} /> Role Restricted
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--text-muted)' }}>{app.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '20px' }}>Requires <strong>{app.requiredRole}</strong> role permission</p>

                  <button className="btn btn-outline" style={{ width: '100%', cursor: 'not-allowed' }} disabled>
                    <Lock size={14} /> Access Denied
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedApp && (
        <ZohoAppModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
};

export default Dashboard;

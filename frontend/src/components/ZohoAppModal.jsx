import React, { useState, useEffect } from 'react';
import { fetchZohoApp } from '../services/api';
import { X, ExternalLink, ShieldCheck, RefreshCw, Layers, CheckCircle } from 'lucide-react';

const ZohoAppModal = ({ app, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAppData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchZohoApp(app.key);
        if (res.success) {
          setData(res);
        } else {
          setError(res.message || 'Failed to connect to Zoho service');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Access Denied: You are not authorized to view this Zoho application.');
      } finally {
        setLoading(false);
      }
    };

    if (app) {
      loadAppData();
    }
  }, [app]);

  if (!app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: 'var(--primary-accent)',
              border: '1px solid var(--border-accent)'
            }}>
              <Layers size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{app.name} Integration</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{app.category} • Role Protected</p>
            </div>
          </div>
          <button className="btn btn-outline" onClick={onClose} style={{ padding: '8px' }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: '12px', animation: 'spin 1s linear infinite' }} />
            <p>Retrieving OAuth token from backend service account...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '24px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185' }}>
            <h4 style={{ marginBottom: '8px' }}>Access Exception</h4>
            <p>{error}</p>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399' }}>
                <ShieldCheck size={20} />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Backend OAuth Token Active</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>No individual user login required • Service Account Managed</div>
                </div>
              </div>
              <span className="user-badge badge-hr">
                <CheckCircle size={12} /> Live Proxy
              </span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-muted)' }}>SERVICE METRICS & DATA</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {Object.entries(data?.content?.data || {}).map(([key, val]) => {
                  if (typeof val === 'string' || typeof val === 'number') {
                    return (
                      <div key={key} style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-accent)', marginTop: '4px' }}>{val}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {data?.content?.data?.recentOnboardings && (
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Recent Onboardings</h5>
                  {data.content.data.recentOnboardings.map((emp, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '600' }}>{emp.name} ({emp.title})</span>
                      <span style={{ color: 'var(--text-muted)' }}>{emp.department} • {emp.startDate}</span>
                    </div>
                  ))}
                </div>
              )}

              {data?.content?.data?.topDeals && (
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Active CRM Deals</h5>
                  {data.content.data.topDeals.map((deal, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '600' }}>{deal.company} - {deal.stage}</span>
                      <span style={{ color: 'var(--emerald-accent)', fontWeight: '700' }}>{deal.value} ({deal.probability})</span>
                    </div>
                  ))}
                </div>
              )}

              {data?.content?.data?.recentTickets && (
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Support Ticket Queue</h5>
                  {data.content.data.recentTickets.map((tkt, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '600' }}>{tkt.id}: {tkt.subject}</span>
                      <span className="user-badge badge-support">{tkt.priority}</span>
                    </div>
                  ))}
                </div>
              )}

              {data?.content?.data?.recentTransactions && (
                <div>
                  <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Recent Financial Invoices</h5>
                  {data.content.data.recentTransactions.map((inv, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: '600' }}>{inv.ref} - {inv.entity}</span>
                      <span style={{ color: 'var(--emerald-accent)', fontWeight: '700' }}>{inv.amount} ({inv.status})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-outline" onClick={onClose}>Close Window</button>
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ textDecoration: 'none' }}
              >
                <span>Launch {app.name} Portal</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}
    </div>
  </div>
);
};

export default ZohoAppModal;

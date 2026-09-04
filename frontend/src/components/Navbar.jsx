import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, LayoutDashboard, UserCog, Cloud } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const roleName = user.role || user.roleName || 'Employee';
  const roleClass = `badge-${roleName.toLowerCase()}`;

  return (
    <nav className="navbar">
      <div className="brand-logo">
        <div className="brand-icon">
          <Cloud size={22} />
        </div>
        <div>
          <span>BrainWave</span>
          <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)', fontWeight: '500' }}>
            Zoho One RBAC Portal
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>

        {isAdmin && (
          <button
            className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('admin')}
          >
            <UserCog size={16} />
            <span>Admin Control Panel</span>
          </button>
        )}
      </div>

      <div className="nav-user">
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
        </div>

        <span className={`user-badge ${roleClass}`}>
          <ShieldCheck size={12} />
          {roleName}
        </span>

        <button className="btn btn-outline" onClick={logout} title="Sign Out">
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

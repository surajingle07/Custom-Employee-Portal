import React, { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUserRole, toggleUserStatus, deleteUser, fetchRoles, fetchPermissions, fetchAuditLogs, fetchZohoStatus } from '../services/api';
import { Users, Shield, FileText, Server, UserPlus, Trash2, Power, RefreshCw, Search, CheckCircle, AlertTriangle, Lock } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [zohoStatus, setZohoStatus] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [searchLog, setSearchLog] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('HR');

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await fetchUsers();
        if (res.success) setUsers(res.users);
      } else if (activeTab === 'roles') {
        const [rRes, pRes] = await Promise.all([fetchRoles(), fetchPermissions()]);
        if (rRes.success) setRoles(rRes.roles);
        if (pRes.success) setPermissions(pRes.permissions);
      } else if (activeTab === 'audit') {
        const res = await fetchAuditLogs();
        if (res.success) setAuditLogs(res.logs);
      } else if (activeTab === 'zoho') {
        const res = await fetchZohoStatus();
        if (res.success) setZohoStatus(res);
      }
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await createUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        roleName: newUserRole
      });
      if (res.success) {
        setShowCreateModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleRoleChange = async (userId, roleName) => {
    try {
      await updateUserRole(userId, roleName);
      loadData();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      loadData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this portal user?')) return;
    try {
      await deleteUser(userId);
      loadData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredLogs = auditLogs.filter(log =>
    log.action?.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.userName?.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.resource?.toLowerCase().includes(searchLog.toLowerCase()) ||
    log.userRole?.toLowerCase().includes(searchLog.toLowerCase())
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage portal identity, roles, permissions, audit trails & Zoho API settings</p>
        </div>

        <button className="btn btn-outline" onClick={loadData} title="Refresh Data">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Admin Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        {[
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: Shield },
          { id: 'audit', label: 'System Audit Logs', icon: FileText },
          { id: 'zoho', label: 'Zoho OAuth Status', icon: Server }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary-accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--primary-accent)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? '700' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Users */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Portal User Accounts ({users.length})</h3>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              <UserPlus size={16} />
              <span>Create New User</span>
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Current Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleName = u.role?.name || u.roleName || 'Employee';
                const roleClass = `badge-${roleName.toLowerCase()}`;
                return (
                  <tr key={u._id || u.id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.82rem', width: 'auto' }}
                        value={roleName}
                        onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                      >
                        <option value="Admin">Admin</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Support">Support</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </td>
                    <td>
                      <span className={`user-badge ${u.isActive !== false ? 'badge-hr' : 'badge-finance'}`}>
                        {u.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '6px' }}
                          onClick={() => handleToggleStatus(u._id || u.id)}
                          title="Toggle Account Status"
                        >
                          <Power size={14} color={u.isActive !== false ? 'var(--emerald-accent)' : 'var(--rose-accent)'} />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px' }}
                          onClick={() => handleDeleteUser(u._id || u.id)}
                          title="Delete Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Roles & Permissions */}
      {activeTab === 'roles' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Role-Based Permission Matrix</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Roles strictly dictate which Zoho One applications are proxied to employee dashboards.
          </p>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Permitted Zoho Application</th>
                <th>Target Module Purpose</th>
                <th>Security Scope</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="user-badge badge-admin">Admin</span></td>
                <td><strong style={{ color: 'var(--primary-accent)' }}>All Zoho Applications</strong></td>
                <td>Full Enterprise Overview & Identity Management</td>
                <td>Global Access</td>
              </tr>
              <tr>
                <td><span className="user-badge badge-hr">HR</span></td>
                <td><strong>Zoho People</strong></td>
                <td>Employee Directory, Leave Requests, Attendance</td>
                <td>Module Isolated</td>
              </tr>
              <tr>
                <td><span className="user-badge badge-sales">Sales</span></td>
                <td><strong>Zoho CRM</strong></td>
                <td>Deals Pipeline, Lead Conversion, Account Management</td>
                <td>Module Isolated</td>
              </tr>
              <tr>
                <td><span className="user-badge badge-support">Support</span></td>
                <td><strong>Zoho Desk</strong></td>
                <td>Customer Service Desk, Ticket Queue</td>
                <td>Module Isolated</td>
              </tr>
              <tr>
                <td><span className="user-badge badge-finance">Finance</span></td>
                <td><strong>Zoho Books</strong></td>
                <td>Invoicing, Expense Management, Profit & Loss</td>
                <td>Module Isolated</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem' }}>System Audit Logs ({filteredLogs.length})</h3>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px', padding: '8px 12px 8px 38px', fontSize: '0.85rem' }}
                placeholder="Filter logs by user, action..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
              />
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / Email</th>
                <th>Role</th>
                <th>Action</th>
                <th>Target Resource</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp || Date.now()).toLocaleString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{log.userName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{log.userEmail}</div>
                  </td>
                  <td>
                    <span className="user-badge badge-support" style={{ fontSize: '0.7rem' }}>
                      {log.userRole}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', fontSize: '0.85rem' }}>{log.action}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--primary-accent)' }}>{log.resource}</td>
                  <td>
                    <span className={`user-badge ${log.status === 'SUCCESS' ? 'badge-hr' : 'badge-finance'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content: Zoho OAuth Status */}
      {activeTab === 'zoho' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Zoho OAuth Backend Service Connection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            The backend manages a single set of service account OAuth credentials so portal users never require personal Zoho credentials.
          </p>

          {zohoStatus ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Integration Mode</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-accent)', marginTop: '4px' }}>
                  {zohoStatus.mode}
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Service Account Status</div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--emerald-accent)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} /> {zohoStatus.serviceAccount} (Authenticated)
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Access Token Expiry</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', marginTop: '4px' }}>
                  {zohoStatus.tokenExpiry}
                </div>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={loadData}>
              Query Backend Zoho API Service
            </button>
          )}
        </div>
      )}

      {/* Modal: Create User */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ marginBottom: '20px' }}>Create Portal Account</h3>

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="johndoe@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Role</label>
                <select
                  className="form-select"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="Admin">Admin (All Apps)</option>
                  <option value="HR">HR (Zoho People)</option>
                  <option value="Sales">Sales (Zoho CRM)</option>
                  <option value="Support">Support (Zoho Desk)</option>
                  <option value="Finance">Finance (Zoho Books)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

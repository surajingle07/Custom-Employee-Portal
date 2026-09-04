const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const logAuditAction = require('../middlewares/auditLogger');
const zohoConfig = require('../config/zoho');

const fallbackUsers = [
  { id: 'usr_admin', name: 'System Admin', email: 'admin@company.com', password: 'Password123!', roleName: 'Admin', allowedApps: ['people', 'crm', 'desk', 'books'] },
  { id: 'usr_hr', name: 'Helen Reed (HR)', email: 'hr@company.com', password: 'Password123!', roleName: 'HR', allowedApps: ['people'] },
  { id: 'usr_sales', name: 'Sam Vance (Sales)', email: 'sales@company.com', password: 'Password123!', roleName: 'Sales', allowedApps: ['crm'] },
  { id: 'usr_support', name: 'Steve Parks (Support)', email: 'support@company.com', password: 'Password123!', roleName: 'Support', allowedApps: ['desk'] },
  { id: 'usr_finance', name: 'Fiona Banks (Finance)', email: 'finance@company.com', password: 'Password123!', roleName: 'Finance', allowedApps: ['books'] }
];

const login = async (req, res) => {
  const email = req.body && req.body.email ? String(req.body.email).trim() : '';
  const password = req.body && req.body.password ? String(req.body.password) : '';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide valid email and password' });
  }

  try {
    let user;
    let roleObj;

    if (User.db && User.db.readyState === 1) {
      user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate({
        path: 'role',
        populate: { path: 'permissions' }
      });

      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          await logAuditAction({ req, action: 'USER_LOGIN', resource: '/api/auth/login', status: 'FAILED', details: `Invalid password for ${email}` });
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isActive) {
          await logAuditAction({ req, action: 'USER_LOGIN', resource: '/api/auth/login', status: 'DENIED', details: `Account disabled for ${email}` });
          return res.status(403).json({ success: false, message: 'User account is deactivated. Contact administrator.' });
        }

        user.lastLogin = new Date();
        await user.save();
        roleObj = user.role;
      }
    }

    if (!user) {
      const fbUser = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (fbUser && fbUser.password === password) {
        user = fbUser;
        roleObj = {
          name: fbUser.roleName,
          allowedApps: fbUser.allowedApps,
          permissions: []
        };
      }
    }

    if (!user) {
      await logAuditAction({ req, action: 'USER_LOGIN', resource: '/api/auth/login', status: 'FAILED', details: `User not found: ${email}` });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const roleName = roleObj.name || user.roleName || 'Employee';
    const allowedApps = roleObj.allowedApps || (zohoConfig.appMappings[roleName] ? zohoConfig.appMappings[roleName].map(a => a.key) : []);
    const permissions = roleObj.permissions ? roleObj.permissions.map(p => typeof p === 'object' ? p.name : p) : [];

    const tokenPayload = {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: roleName,
      roleName,
      allowedApps,
      permissions
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'super_secret_jwt_key_brainwave_zoho_portal_2026',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    req.user = tokenPayload;
    await logAuditAction({ req, action: 'USER_LOGIN', resource: '/api/auth/login', status: 'SUCCESS', details: `User logged in with role ${roleName}` });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: roleName,
        allowedApps,
        permissions,
        zohoServices: zohoConfig.appMappings[roleName] || []
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server authentication error' });
  }
};

const getMe = async (req, res) => {
  try {
    const roleName = req.user.roleName || req.user.role;
    return res.status(200).json({
      success: true,
      user: {
        ...req.user,
        zohoServices: zohoConfig.appMappings[roleName] || []
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

module.exports = {
  login,
  getMe
};

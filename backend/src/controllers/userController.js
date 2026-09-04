const User = require('../models/User');
const Role = require('../models/Role');
const logAuditAction = require('../middlewares/auditLogger');
const zohoConfig = require('../config/zoho');

let mockUserStore = [
  { id: 'usr_admin', name: 'System Admin', email: 'admin@company.com', role: { name: 'Admin' }, isActive: true, createdAt: new Date() },
  { id: 'usr_hr', name: 'Helen Reed (HR)', email: 'hr@company.com', role: { name: 'HR' }, isActive: true, createdAt: new Date() },
  { id: 'usr_sales', name: 'Sam Vance (Sales)', email: 'sales@company.com', role: { name: 'Sales' }, isActive: true, createdAt: new Date() },
  { id: 'usr_support', name: 'Steve Parks (Support)', email: 'support@company.com', role: { name: 'Support' }, isActive: true, createdAt: new Date() },
  { id: 'usr_finance', name: 'Fiona Banks (Finance)', email: 'finance@company.com', role: { name: 'Finance' }, isActive: true, createdAt: new Date() }
];

const getUsers = async (req, res) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const users = await User.find().populate('role').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, users });
    }
    return res.status(200).json({ success: true, count: mockUserStore.length, users: mockUserStore });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user list' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, roleName } = req.body;

  if (!name || !email || !password || !roleName) {
    return res.status(400).json({ success: false, message: 'Missing required user fields' });
  }

  try {
    if (User.db && User.db.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      let role = await Role.findOne({ name: roleName });
      if (!role) {
        role = await Role.create({ name: roleName, allowedApps: (zohoConfig.appMappings[roleName] || []).map(a => a.key) });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: role._id
      });

      await logAuditAction({ req, action: 'CREATE_USER', resource: `/api/admin/users/${user._id}`, status: 'SUCCESS', details: `Created user ${email} with role ${roleName}` });

      const populatedUser = await User.findById(user._id).populate('role');
      return res.status(201).json({ success: true, user: populatedUser });
    }

    const newMockUser = {
      id: 'usr_' + Date.now().toString(36),
      name,
      email: email.toLowerCase(),
      role: { name: roleName },
      isActive: true,
      createdAt: new Date()
    };
    mockUserStore.unshift(newMockUser);

    await logAuditAction({ req, action: 'CREATE_USER', resource: `/api/admin/users/${newMockUser.id}`, status: 'SUCCESS', details: `Created mock user ${email} with role ${roleName}` });

    return res.status(201).json({ success: true, user: newMockUser });
  } catch (error) {
    console.error('Create User Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { roleName } = req.body;

  try {
    if (User.db && User.db.readyState === 1) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(404).json({ success: false, message: `Role '${roleName}' not found` });
      }

      const user = await User.findByIdAndUpdate(userId, { role: role._id }, { new: true }).populate('role');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      await logAuditAction({ req, action: 'UPDATE_USER_ROLE', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Updated role of ${user.email} to ${roleName}` });

      return res.status(200).json({ success: true, user });
    }

    const idx = mockUserStore.findIndex(u => u.id === userId);
    if (idx !== -1) {
      mockUserStore[idx].role = { name: roleName };
      await logAuditAction({ req, action: 'UPDATE_USER_ROLE', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Updated role of ${mockUserStore[idx].email} to ${roleName}` });
      return res.status(200).json({ success: true, user: mockUserStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user role' });
  }
};

const toggleUserStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.isActive = !user.isActive;
      await user.save();

      await logAuditAction({ req, action: 'TOGGLE_USER_STATUS', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Changed status of ${user.email} to ${user.isActive ? 'Active' : 'Disabled'}` });

      return res.status(200).json({ success: true, user });
    }

    const idx = mockUserStore.findIndex(u => u.id === userId);
    if (idx !== -1) {
      mockUserStore[idx].isActive = !mockUserStore[idx].isActive;
      await logAuditAction({ req, action: 'TOGGLE_USER_STATUS', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Changed status of ${mockUserStore[idx].email} to ${mockUserStore[idx].isActive ? 'Active' : 'Disabled'}` });
      return res.status(200).json({ success: true, user: mockUserStore[idx] });
    }

    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle user status' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      await logAuditAction({ req, action: 'DELETE_USER', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Deleted user ${user.email}` });

      return res.status(200).json({ success: true, message: 'User removed successfully' });
    }

    mockUserStore = mockUserStore.filter(u => u.id !== userId);
    await logAuditAction({ req, action: 'DELETE_USER', resource: `/api/admin/users/${userId}`, status: 'SUCCESS', details: `Deleted mock user ${userId}` });

    return res.status(200).json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser
};

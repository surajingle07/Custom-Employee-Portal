const Role = require('../models/Role');
const Permission = require('../models/Permission');
const zohoConfig = require('../config/zoho');

const getRoles = async (req, res) => {
  try {
    if (Role.db && Role.db.readyState === 1) {
      const roles = await Role.find().populate('permissions');
      return res.status(200).json({ success: true, roles });
    }

    const defaultRoles = [
      { name: 'Admin', description: 'Full system administrative access to all portal modules and Zoho services', allowedApps: ['people', 'crm', 'desk', 'books'] },
      { name: 'HR', description: 'Human Resources access reserved strictly for Zoho People employee management', allowedApps: ['people'] },
      { name: 'Sales', description: 'Sales team access reserved for Zoho CRM customer relationship management', allowedApps: ['crm'] },
      { name: 'Support', description: 'Customer support access reserved for Zoho Desk ticketing platform', allowedApps: ['desk'] },
      { name: 'Finance', description: 'Financial & Accounting access reserved strictly for Zoho Books', allowedApps: ['books'] }
    ];

    return res.status(200).json({ success: true, roles: defaultRoles });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
};

const getPermissions = async (req, res) => {
  try {
    if (Permission.db && Permission.db.readyState === 1) {
      const permissions = await Permission.find();
      return res.status(200).json({ success: true, permissions });
    }

    const defaultPermissions = [
      { name: 'access_zoho_people', module: 'HR', description: 'Access to Zoho People service' },
      { name: 'access_zoho_crm', module: 'Sales', description: 'Access to Zoho CRM service' },
      { name: 'access_zoho_desk', module: 'Support', description: 'Access to Zoho Desk service' },
      { name: 'access_zoho_books', module: 'Finance', description: 'Access to Zoho Books service' },
      { name: 'manage_users', module: 'Admin', description: 'Create, update and delete portal users' },
      { name: 'manage_roles', module: 'Admin', description: 'Configure roles and assign permissions' },
      { name: 'view_audit_logs', module: 'Admin', description: 'View system audit trails' }
    ];

    return res.status(200).json({ success: true, permissions: defaultPermissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
  }
};

module.exports = {
  getRoles,
  getPermissions
};

const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const AuditLog = require('../models/AuditLog');

const permissionsData = [
  { name: 'access_zoho_people', module: 'HR', description: 'Access to Zoho People service' },
  { name: 'access_zoho_crm', module: 'Sales', description: 'Access to Zoho CRM service' },
  { name: 'access_zoho_desk', module: 'Support', description: 'Access to Zoho Desk service' },
  { name: 'access_zoho_books', module: 'Finance', description: 'Access to Zoho Books service' },
  { name: 'manage_users', module: 'Admin', description: 'Create, update and delete portal users' },
  { name: 'manage_roles', module: 'Admin', description: 'Configure roles and assign permissions' },
  { name: 'view_audit_logs', module: 'Admin', description: 'View system audit logs' }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_portal');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Role.deleteMany({});
    await Permission.deleteMany({});
    await AuditLog.deleteMany({});

    console.log('Seeding permissions...');
    const createdPermissions = await Permission.insertMany(permissionsData);
    const permMap = {};
    createdPermissions.forEach(p => { permMap[p.name] = p._id; });

    console.log('Seeding roles...');
    const rolesData = [
      {
        name: 'Admin',
        description: 'Full portal and Zoho One administration privileges',
        permissions: Object.values(permMap),
        allowedApps: ['people', 'crm', 'desk', 'books']
      },
      {
        name: 'HR',
        description: 'Human Resources role with access to Zoho People',
        permissions: [permMap['access_zoho_people']],
        allowedApps: ['people']
      },
      {
        name: 'Sales',
        description: 'Sales role with access to Zoho CRM',
        permissions: [permMap['access_zoho_crm']],
        allowedApps: ['crm']
      },
      {
        name: 'Support',
        description: 'Support role with access to Zoho Desk',
        permissions: [permMap['access_zoho_desk']],
        allowedApps: ['desk']
      },
      {
        name: 'Finance',
        description: 'Finance role with access to Zoho Books',
        permissions: [permMap['access_zoho_books']],
        allowedApps: ['books']
      }
    ];

    const createdRoles = await Role.insertMany(rolesData);
    const roleMap = {};
    createdRoles.forEach(r => { roleMap[r.name] = r._id; });

    console.log('Seeding default users...');
    const usersData = [
      { name: 'System Admin', email: 'admin@company.com', password: 'Password123!', role: roleMap['Admin'] },
      { name: 'Helen Reed (HR)', email: 'hr@company.com', password: 'Password123!', role: roleMap['HR'] },
      { name: 'Sam Vance (Sales)', email: 'sales@company.com', password: 'Password123!', role: roleMap['Sales'] },
      { name: 'Steve Parks (Support)', email: 'support@company.com', password: 'Password123!', role: roleMap['Support'] },
      { name: 'Fiona Banks (Finance)', email: 'finance@company.com', password: 'Password123!', role: roleMap['Finance'] }
    ];

    for (const u of usersData) {
      const user = new User(u);
      await user.save();
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

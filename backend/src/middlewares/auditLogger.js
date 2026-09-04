const AuditLog = require('../models/AuditLog');

const memoryAuditLogs = [];

const logAuditAction = async ({ req, action, resource, status = 'SUCCESS', details = '' }) => {
  try {
    const user = req ? req.user : null;
    const logData = {
      user: user ? user.id : null,
      userName: user ? user.name : 'System/Guest',
      userEmail: user ? user.email : 'guest@portal.com',
      userRole: user ? (user.roleName || user.role) : 'N/A',
      action,
      resource,
      status,
      ipAddress: req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1',
      details,
      timestamp: new Date()
    };

    memoryAuditLogs.unshift(logData);
    if (memoryAuditLogs.length > 500) memoryAuditLogs.pop();

    if (AuditLog.db && AuditLog.db.readyState === 1) {
      await AuditLog.create(logData);
    }
  } catch (error) {
    console.error('Audit Log Error:', error.message);
  }
};

const getMemoryLogs = () => memoryAuditLogs;

module.exports = logAuditAction;
module.exports.getMemoryLogs = getMemoryLogs;

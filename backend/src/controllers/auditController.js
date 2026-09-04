const AuditLog = require('../models/AuditLog');
const { getMemoryLogs } = require('../middlewares/auditLogger');

const getAuditLogs = async (req, res) => {
  try {
    let logs = [];
    if (AuditLog.db && AuditLog.db.readyState === 1) {
      logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    } else {
      logs = getMemoryLogs();
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
};

module.exports = {
  getAuditLogs
};

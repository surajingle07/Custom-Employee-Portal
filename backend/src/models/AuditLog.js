const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'DENIED', 'FAILED'],
    default: 'SUCCESS'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  details: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);

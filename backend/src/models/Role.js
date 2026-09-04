const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Admin', 'HR', 'Sales', 'Support', 'Finance'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  allowedApps: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);

const mongoose = require('mongoose');

const salaryGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'Group Name is required'],
    trim: true,
    unique: true
  },
  basicFrom: {
    type: Number,
    default: 0
  },
  basicTo: {
    type: Number,
    default: 0
  },
  gradePay: {
    type: Number,
    default: 0
  },
  payScale: {
    type: String,
    default: '0.00'
  },
  heads: [{
    headId: { type: mongoose.Schema.Types.ObjectId, ref: 'SalaryHead' },
    headName: String,
    val: { type: String, default: '0.00' },
    vType: String,
    selected: { type: Boolean, default: false }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SalaryGroup', salaryGroupSchema);

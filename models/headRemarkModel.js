const mongoose = require('mongoose');

const headRemarkSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffName: {
    type: String,
    default: ''
  },
  staffCode: {
    type: String,
    default: ''
  },
  salaryMonth: {
    type: String,
    required: true
  },
  salaryHead: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  remark: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HeadRemark', headRemarkSchema);

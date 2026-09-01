const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  remarkName: {
    type: String,
    required: [true, 'Remark name is required'],
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Remark = mongoose.model('Remark', remarkSchema);

module.exports = Remark;

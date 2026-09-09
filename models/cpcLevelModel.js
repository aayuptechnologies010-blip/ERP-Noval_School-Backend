const mongoose = require('mongoose');

const cpcLevelSchema = new mongoose.Schema({
  cpcLevel: {
    type: String,
    required: [true, '7th CPC Level is required'],
    trim: true,
    unique: true
  },
  orderNo: {
    type: Number,
    required: [true, 'Order No is required']
  },
  noOfCells: {
    type: Number,
    default: 40
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    default: 0
  },
  cells: [{
    cellIndex: Number,
    amount: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CPCLevel', cpcLevelSchema);

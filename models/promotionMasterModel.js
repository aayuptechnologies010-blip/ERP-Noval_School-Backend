const mongoose = require('mongoose');

const promotionMasterSchema = new mongoose.Schema({
  promotionName: {
    type: String,
    required: [true, 'Promotion name is required'],
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

const PromotionMaster = mongoose.model('PromotionMaster', promotionMasterSchema);

module.exports = PromotionMaster;

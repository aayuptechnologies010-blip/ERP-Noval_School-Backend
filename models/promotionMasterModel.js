const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('PromotionMaster', schema);
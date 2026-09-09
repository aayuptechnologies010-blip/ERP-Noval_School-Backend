const mongoose = require('mongoose');

const meritCriteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxPoint: { type: Number, required: true, default: 25 },
  session: { type: String, default: '2026-2027' },
  class: { type: String, default: 'All' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MeritCriteria', meritCriteriaSchema);

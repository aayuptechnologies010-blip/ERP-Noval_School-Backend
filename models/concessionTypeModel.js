const mongoose = require('mongoose');

const concessionTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ConcessionType', concessionTypeSchema);

const mongoose = require('mongoose');

const concessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Concession', concessionSchema);

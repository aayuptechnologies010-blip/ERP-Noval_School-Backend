const mongoose = require('mongoose');

const schoolDocSchema = new mongoose.Schema({
  type: { type: String, required: true },
  documentName: { type: String, required: true },
  photo: { type: String, default: '' },
  uploadDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  select: { type: Boolean, default: true },
  status: { type: String, default: 'Verified' }
}, { timestamps: true });

module.exports = mongoose.model('SchoolDoc', schoolDocSchema);

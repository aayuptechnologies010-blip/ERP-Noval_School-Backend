const mongoose = require('mongoose');

const staffdocumenttypeSchema = new mongoose.Schema({
  type: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('StaffDocumentType', staffdocumenttypeSchema);
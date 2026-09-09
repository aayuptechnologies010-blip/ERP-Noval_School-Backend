const mongoose = require('mongoose');

const relateClassSectionSchema = new mongoose.Schema({ className: { type: String, required: true }, sections: [{ type: String }] }, { timestamps: true });

module.exports = mongoose.model('RelateClassSection', relateClassSectionSchema);

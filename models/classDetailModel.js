const mongoose = require('mongoose');

const classDetailSchema = new mongoose.Schema({ className: { type: String, required: true }, wingName: String, orderNo: Number, schoolName: String }, { timestamps: true });

module.exports = mongoose.model('ClassDetail', classDetailSchema);

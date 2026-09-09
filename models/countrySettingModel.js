const mongoose = require('mongoose');
const countrySettingSchema = mongoose.Schema({
  country: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('CountrySetting', countrySettingSchema);

const mongoose = require('mongoose');

const feeMasterSettingSchema = new mongoose.Schema(
  {
    settingKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    settingValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const FeeMasterSetting = mongoose.model('FeeMasterSetting', feeMasterSettingSchema);
module.exports = FeeMasterSetting;

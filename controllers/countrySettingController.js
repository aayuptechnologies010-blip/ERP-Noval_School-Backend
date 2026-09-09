const CountrySetting = require('../models/countrySettingModel');
exports.getCountrySetting = async (req, res) => {
  try {
    const setting = await CountrySetting.findOne();
    if (setting) return res.json(setting);
    return res.json({ country: 'India' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.updateCountrySetting = async (req, res) => {
  try {
    let setting = await CountrySetting.findOne();
    if (setting) {
      setting.country = req.body.country;
      await setting.save();
    } else {
      setting = await CountrySetting.create({ country: req.body.country });
    }
    res.json(setting);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const GlobalSearchSetting = require('../models/globalSearchSettingModel');

// @desc    Get global search settings
// @route   GET /api/global-search-settings
// @access  Private
const getGlobalSearchSettings = async (req, res) => {
  try {
    let settings = await GlobalSearchSetting.findOne();
    
    // If no settings exist yet, create default settings
    if (!settings) {
      settings = await GlobalSearchSetting.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update global search settings
// @route   PUT /api/global-search-settings
// @access  Private
const updateGlobalSearchSettings = async (req, res) => {
  try {
    const { searchOptionsForStudents, displayOnReport } = req.body;

    let settings = await GlobalSearchSetting.findOne();

    if (!settings) {
      settings = await GlobalSearchSetting.create({});
    }

    if (searchOptionsForStudents) {
      settings.searchOptionsForStudents = {
        ...settings.searchOptionsForStudents,
        ...searchOptionsForStudents
      };
    }

    if (displayOnReport) {
      settings.displayOnReport = displayOnReport;
    }

    const updatedSettings = await settings.save();
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGlobalSearchSettings,
  updateGlobalSearchSettings
};

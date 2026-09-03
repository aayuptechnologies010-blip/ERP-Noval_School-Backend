const TCSetting = require('../models/tcSettingModel');

// @desc    Get TC form setting (singleton)
// @route   GET /api/tc-settings
// @access  Private
const getTCSetting = async (req, res) => {
  try {
    let setting = await TCSetting.findOne();
    
    if (!setting) {
      setting = await TCSetting.create({
        subjectFromMarksManager: true,
        subjectFromTimeTable: true,
        attendanceFromECare: true,
        checkDuesInFees: true,
        checkDuesInLibrary: true
      });
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create TC form setting
// @route   PUT /api/tc-settings
// @access  Private
const upsertTCSetting = async (req, res) => {
  try {
    const {
      subjectFromMarksManager,
      subjectFromTimeTable,
      attendanceFromECare,
      checkDuesInFees,
      checkDuesInLibrary
    } = req.body;

    let setting = await TCSetting.findOne();

    if (!setting) {
      setting = await TCSetting.create({
        subjectFromMarksManager,
        subjectFromTimeTable,
        attendanceFromECare,
        checkDuesInFees,
        checkDuesInLibrary
      });
    } else {
      if (subjectFromMarksManager !== undefined) setting.subjectFromMarksManager = subjectFromMarksManager;
      if (subjectFromTimeTable !== undefined) setting.subjectFromTimeTable = subjectFromTimeTable;
      if (attendanceFromECare !== undefined) setting.attendanceFromECare = attendanceFromECare;
      if (checkDuesInFees !== undefined) setting.checkDuesInFees = checkDuesInFees;
      if (checkDuesInLibrary !== undefined) setting.checkDuesInLibrary = checkDuesInLibrary;

      await setting.save();
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTCSetting,
  upsertTCSetting
};

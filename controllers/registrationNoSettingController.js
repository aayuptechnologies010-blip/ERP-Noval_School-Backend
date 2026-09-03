const RegistrationNoSetting = require('../models/registrationNoSettingModel');
const SchoolGlobalDetails = require('../models/schoolGlobalDetailsModel');
const SchoolClass = require('../models/schoolClassModel');
const AcademicYear = require('../models/academicYearModel');
const SchoolBoard = require('../models/schoolBoardModel');

// @desc    Get options for dropdowns dynamically
// @route   GET /api/registration-no-settings/options
// @access  Private
const getDropdownOptions = async (req, res) => {
  try {
    const schools = await SchoolGlobalDetails.find({});
    const classes = await SchoolClass.find({});
    const sessions = await AcademicYear.find({}).sort({ startDate: -1 });
    const boards = await SchoolBoard.find({});

    res.status(200).json({
      schools,
      classes,
      sessions,
      boards
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific registration no setting
// @route   GET /api/registration-no-settings
// @access  Private
const getRegistrationNoSetting = async (req, res) => {
  try {
    const { school, classId, session, board, settingFor } = req.query;

    if (!school || !classId || !session || !board || !settingFor) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }

    const setting = await RegistrationNoSetting.findOne({
      school,
      class: classId,
      session,
      board,
      settingFor
    })
    .populate('school')
    .populate('class')
    .populate('session')
    .populate('board');

    if (!setting) {
      return res.status(200).json({
        school,
        class: classId,
        session,
        board,
        settingFor,
        settingType: 'Automatic',
        recNoStartFrom: 1,
        prefix: '',
        startFrom: 1,
        leadZero: 0,
        suffix: ''
      });
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update registration no setting
// @route   POST /api/registration-no-settings
// @access  Private
const upsertRegistrationNoSetting = async (req, res) => {
  try {
    const { school, classId, session, board, settingFor, ...updateData } = req.body;

    if (!school || !classId || !session || !board || !settingFor) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedSetting = await RegistrationNoSetting.findOneAndUpdate(
      { school, class: classId, session, board, settingFor },
      { $set: updateData },
      { new: true, runValidators: true, upsert: true }
    )
    .populate('school')
    .populate('class')
    .populate('session')
    .populate('board');

    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDropdownOptions,
  getRegistrationNoSetting,
  upsertRegistrationNoSetting
};

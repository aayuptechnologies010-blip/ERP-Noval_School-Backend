const ReportLayoutSetting = require('../models/reportLayoutSettingModel');

// @desc    Create a new report layout setting
// @route   POST /api/report-layout-settings
// @access  Private
const createReportLayoutSetting = async (req, res) => {
  try {
    const { reportName } = req.body;

    if (!reportName) {
      return res.status(400).json({ message: 'Report Name is required' });
    }

    const exists = await ReportLayoutSetting.findOne({ reportName: { $regex: new RegExp(`^${reportName}$`, 'i') } });

    if (exists) {
      return res.status(400).json({ message: 'Report Name already exists' });
    }

    const setting = await ReportLayoutSetting.create(req.body);

    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all report layout settings
// @route   GET /api/report-layout-settings
// @access  Private
const getReportLayoutSettings = async (req, res) => {
  try {
    const settings = await ReportLayoutSetting.find({}).sort({ createdAt: -1 });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report layout setting by ID
// @route   GET /api/report-layout-settings/:id
// @access  Private
const getReportLayoutSettingById = async (req, res) => {
  try {
    const setting = await ReportLayoutSetting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a report layout setting
// @route   PUT /api/report-layout-settings/:id
// @access  Private
const updateReportLayoutSetting = async (req, res) => {
  try {
    const { reportName } = req.body;
    const setting = await ReportLayoutSetting.findById(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }

    if (reportName && reportName.toLowerCase() !== setting.reportName.toLowerCase()) {
      const exists = await ReportLayoutSetting.findOne({ reportName: { $regex: new RegExp(`^${reportName}$`, 'i') } });
      if (exists) {
        return res.status(400).json({ message: 'Report Name already in use' });
      }
    }

    // Update fields dynamically
    for (const key in req.body) {
      setting[key] = req.body[key];
    }

    const updatedSetting = await setting.save();
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a report layout setting
// @route   DELETE /api/report-layout-settings/:id
// @access  Private
const deleteReportLayoutSetting = async (req, res) => {
  try {
    const setting = await ReportLayoutSetting.findById(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }

    await setting.deleteOne();
    res.status(200).json({ message: 'Report Layout Setting removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReportLayoutSetting,
  getReportLayoutSettings,
  getReportLayoutSettingById,
  updateReportLayoutSetting,
  deleteReportLayoutSetting
};

const ReportLayoutSetting = require('../models/reportLayoutSettingModel');

// @desc    Create a new report layout setting
// @route   POST /api/report-layout-settings
const create = async (req, res) => {
  try {
    const reportName = req.body.reportName || req.body.name;

    if (!reportName) {
      return res.status(400).json({ message: 'Report Name is required' });
    }

    const exists = await ReportLayoutSetting.findOne({
      $or: [
        { reportName: { $regex: new RegExp(`^${reportName}$`, 'i') } },
        { name: { $regex: new RegExp(`^${reportName}$`, 'i') } }
      ]
    });

    if (exists) {
      return res.status(400).json({ message: 'Report Name already exists' });
    }

    const payload = {
      ...req.body,
      reportName: reportName,
      name: reportName
    };

    const setting = await ReportLayoutSetting.create(payload);
    res.status(201).json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message, message: error.message });
  }
};

// @desc    Get all report layout settings
// @route   GET /api/report-layout-settings
const getAll = async (req, res) => {
  try {
    const settings = await ReportLayoutSetting.find({}).sort({ createdAt: -1 });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message, message: error.message });
  }
};

// @desc    Get report layout setting by ID
// @route   GET /api/report-layout-settings/:id
const getById = async (req, res) => {
  try {
    const setting = await ReportLayoutSetting.findById(req.params.id);
    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message, message: error.message });
  }
};

// @desc    Update a report layout setting
// @route   PUT /api/report-layout-settings/:id
const update = async (req, res) => {
  try {
    const reportName = req.body.reportName || req.body.name;
    const setting = await ReportLayoutSetting.findById(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }

    if (reportName && reportName.toLowerCase() !== (setting.reportName || setting.name || '').toLowerCase()) {
      const exists = await ReportLayoutSetting.findOne({
        $or: [
          { reportName: { $regex: new RegExp(`^${reportName}$`, 'i') } },
          { name: { $regex: new RegExp(`^${reportName}$`, 'i') } }
        ]
      });
      if (exists) {
        return res.status(400).json({ message: 'Report Name already in use' });
      }
    }

    for (const key in req.body) {
      setting[key] = req.body[key];
    }
    if (reportName) {
      setting.name = reportName;
      setting.reportName = reportName;
    }

    const updatedSetting = await setting.save();
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: error.message, message: error.message });
  }
};

// @desc    Delete a report layout setting
// @route   DELETE /api/report-layout-settings/:id
const remove = async (req, res) => {
  try {
    const setting = await ReportLayoutSetting.findById(req.params.id);

    if (!setting) {
      return res.status(404).json({ message: 'Report Layout Setting not found' });
    }

    await setting.deleteOne();
    res.status(200).json({ message: 'Report Layout Setting removed' });
  } catch (error) {
    res.status(500).json({ error: error.message, message: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  // Aliases for local usage
  createReportLayoutSetting: create,
  getReportLayoutSettings: getAll,
  getReportLayoutSettingById: getById,
  updateReportLayoutSetting: update,
  deleteReportLayoutSetting: remove
};
const MeritList = require('../models/meritListModel');

// @desc Get all merit lists
// @route GET /api/merit-lists
exports.getAllMeritLists = async (req, res) => {
  try {
    const { session, class: cls } = req.query;
    const filter = {};
    if (session && session !== 'Select Session') filter.session = session;
    if (cls && cls !== 'Select Class' && cls !== 'All') filter.class = cls;
    const lists = await MeritList.find(filter).sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a new merit list
// @route POST /api/merit-lists
exports.createMeritList = async (req, res) => {
  try {
    const { name, session, class: cls, fromDate, toDate, minPoint, applicantLimit, applicants } = req.body;
    const meritList = new MeritList({
      name,
      session: session || '2026-2027',
      class: cls || 'All',
      fromDate: fromDate || '01-Sep-2026',
      toDate: toDate || '20-Sep-2026',
      minPoint: Number(minPoint) || 50,
      applicantLimit: Number(applicantLimit) || 30,
      applicant: applicants ? applicants.length : (Number(applicantLimit) || 30),
      allotted: applicants ? applicants.filter(a => a.status === 'Selected').length : Math.min(Number(applicantLimit) || 30, 25),
      status: 'Active',
      applicants: applicants || []
    });
    const saved = await meritList.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single merit list by ID
// @route GET /api/merit-lists/:id
exports.getMeritListById = async (req, res) => {
  try {
    const list = await MeritList.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'Merit list not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a merit list
// @route DELETE /api/merit-lists/:id
exports.deleteMeritList = async (req, res) => {
  try {
    const deleted = await MeritList.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Merit list not found' });
    res.json({ message: 'Merit list deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const MeritCriteria = require('../models/meritCriteriaModel');

// @desc Get all merit criteria
// @route GET /api/merit-criteria
exports.getAllCriteria = async (req, res) => {
  try {
    const { session, class: cls } = req.query;
    const filter = {};
    if (session) filter.session = session;
    if (cls && cls !== 'All') filter.class = cls;
    const list = await MeritCriteria.find(filter).sort({ createdAt: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create merit criteria
// @route POST /api/merit-criteria
exports.createCriteria = async (req, res) => {
  try {
    const { name, maxPoint, session, class: cls, description } = req.body;
    const item = new MeritCriteria({
      name,
      maxPoint: Number(maxPoint) || 25,
      session: session || '2026-2027',
      class: cls || 'All',
      description: description || ''
    });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update criteria
// @route PUT /api/merit-criteria/:id
exports.updateCriteria = async (req, res) => {
  try {
    const updated = await MeritCriteria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Criteria not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete criteria
// @route DELETE /api/merit-criteria/:id
exports.deleteCriteria = async (req, res) => {
  try {
    const deleted = await MeritCriteria.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Criteria not found' });
    res.json({ message: 'Criteria deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

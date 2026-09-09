const AdmissionForm = require('../models/admissionFormModel');

exports.create = async (req, res) => {
  try {
    const doc = await AdmissionForm.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.class) filter.class = req.query.class;
    if (req.query.session) filter.session = req.query.session;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { regNo: { $regex: req.query.search, $options: 'i' } },
        { prosNo: { $regex: req.query.search, $options: 'i' } },
        { enqNo: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const docs = await AdmissionForm.find(filter).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const doc = await AdmissionForm.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const doc = await AdmissionForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const doc = await AdmissionForm.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpdate = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ message: 'Invalid ids' });
    
    await AdmissionForm.updateMany(
      { _id: { $in: ids } },
      { $set: { status: status } }
    );
    res.status(200).json({ message: 'Bulk update successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

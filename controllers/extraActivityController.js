const ExtraActivity = require('../models/extraActivityModel.js');

exports.create = async (req, res) => {
  try {
    const doc = await ExtraActivity.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAll = async (req, res) => {
  try {
    const docs = await ExtraActivity.find();
    res.status(200).json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const doc = await ExtraActivity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const doc = await ExtraActivity.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
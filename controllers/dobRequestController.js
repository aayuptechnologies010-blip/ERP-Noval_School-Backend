const DobRequest = require('../models/dobRequestModel');

exports.getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const docs = await DobRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const doc = await DobRequest.create(req.body);
    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const doc = await DobRequest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, actionDate: Date.now() },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await DobRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
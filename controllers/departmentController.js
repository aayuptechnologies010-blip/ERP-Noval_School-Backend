const Department = require('../models/departmentModel');

const getAll = async (req, res) => {
  try {
    const data = await Department.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try {
    const data = await Department.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const update = async (req, res) => {
  try {
    const data = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const remove = async (req, res) => {
  try {
    const data = await Department.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAll, create, update, remove };
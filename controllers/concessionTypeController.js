const ConcessionType = require('../models/concessionTypeModel');

const getConcessionTypes = async (req, res) => {
  try {
    const types = await ConcessionType.find().sort({ createdAt: -1 });
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConcessionType = async (req, res) => {
  try {
    const exists = await ConcessionType.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: 'Concession Type already exists' });

    const type = await ConcessionType.create(req.body);
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateConcessionType = async (req, res) => {
  try {
    const type = await ConcessionType.findById(req.params.id);
    if (type) {
      type.name = req.body.name || type.name;
      const updated = await type.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteConcessionType = async (req, res) => {
  try {
    const type = await ConcessionType.findById(req.params.id);
    if (type) {
      await type.deleteOne();
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConcessionTypes, createConcessionType, updateConcessionType, deleteConcessionType };

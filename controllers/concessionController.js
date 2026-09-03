const Concession = require('../models/concessionModel');

const getConcessions = async (req, res) => {
  try {
    const concessions = await Concession.find().sort({ createdAt: -1 });
    res.json(concessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createConcession = async (req, res) => {
  try {
    const exists = await Concession.findOne({ name: req.body.name });
    if (exists) return res.status(400).json({ message: 'Concession Name already exists' });

    const concession = await Concession.create(req.body);
    res.status(201).json(concession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateConcession = async (req, res) => {
  try {
    const concession = await Concession.findById(req.params.id);
    if (concession) {
      concession.name = req.body.name || concession.name;
      concession.type = req.body.type || concession.type;
      
      const updated = await concession.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteConcession = async (req, res) => {
  try {
    const concession = await Concession.findById(req.params.id);
    if (concession) {
      await concession.deleteOne();
      res.json({ message: 'Removed' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getConcessions, createConcession, updateConcession, deleteConcession };

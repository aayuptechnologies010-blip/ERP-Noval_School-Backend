const RelateClassSection = require('../models/relateClassSectionModel');

exports.createRelateClassSection = async (req, res) => {
  try {
    const newDoc = new RelateClassSection(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelateClassSections = async (req, res) => {
  try {
    const docs = await RelateClassSection.find();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRelateClassSectionById = async (req, res) => {
  try {
    const doc = await RelateClassSection.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'RelateClassSection not found' });
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRelateClassSection = async (req, res) => {
  try {
    const updatedDoc = await RelateClassSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoc) return res.status(404).json({ message: 'RelateClassSection not found' });
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRelateClassSection = async (req, res) => {
  try {
    const deletedDoc = await RelateClassSection.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ message: 'RelateClassSection not found' });
    res.status(200).json({ message: 'RelateClassSection deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

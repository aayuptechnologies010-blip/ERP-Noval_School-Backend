const ClassDetail = require('../models/classDetailModel');

exports.createClassDetail = async (req, res) => {
  try {
    const newDoc = new ClassDetail(req.body);
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassDetails = async (req, res) => {
  try {
    const docs = await ClassDetail.find();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassDetailById = async (req, res) => {
  try {
    const doc = await ClassDetail.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'ClassDetail not found' });
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateClassDetail = async (req, res) => {
  try {
    const updatedDoc = await ClassDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoc) return res.status(404).json({ message: 'ClassDetail not found' });
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClassDetail = async (req, res) => {
  try {
    const deletedDoc = await ClassDetail.findByIdAndDelete(req.params.id);
    if (!deletedDoc) return res.status(404).json({ message: 'ClassDetail not found' });
    res.status(200).json({ message: 'ClassDetail deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

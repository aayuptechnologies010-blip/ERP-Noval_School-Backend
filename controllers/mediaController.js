const Media = require('../models/mediaModel');

const getAllMedia = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const items = await Media.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMediaById = async (req, res) => {
  try {
    const item = await Media.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Media not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMedia = async (req, res) => {
  try {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (req.file) body.fileUrl = `/uploads/${req.file.filename}`;
    const item = new Media({ ...body, createdBy: req.user?._id });
    const saved = await item.save();
    res.status(201).json({ message: 'Media uploaded successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMedia = async (req, res) => {
  try {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (req.file) body.fileUrl = `/uploads/${req.file.filename}`;
    const item = await Media.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!item) return res.status(404).json({ message: 'Media not found' });
    res.json({ message: 'Media updated', data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedia = async (req, res) => {
  try {
    const item = await Media.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Media not found' });
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia };

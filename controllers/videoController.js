const Video = require('../models/videoModel');

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createVideo = async (req, res) => {
  try {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (req.file) body.thumbnail = `/uploads/${req.file.filename}`;
    const video = new Video({ ...body, createdBy: req.user?._id });
    const saved = await video.save();
    res.status(201).json({ message: 'Video added successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVideo = async (req, res) => {
  try {
    const body = req.body.data ? JSON.parse(req.body.data) : req.body;
    if (req.file) body.thumbnail = `/uploads/${req.file.filename}`;
    const video = await Video.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video updated', data: video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllVideos, getVideoById, createVideo, updateVideo, deleteVideo };

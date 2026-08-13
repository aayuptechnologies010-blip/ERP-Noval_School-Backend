const Circular = require('../models/circularModel');

const getFileUrl = (req, fieldName) => {
  if (req.file && req.file.fieldname === fieldName) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return '';
};

// @desc    Create a new circular
// @route   POST /api/circulars
// @access  Private (Admin)
const createCircular = async (req, res) => {
  try {
    let data = req.body;
    if (req.body.data) {
       data = JSON.parse(req.body.data);
    }

    const circular = new Circular({
      ...data,
      createdBy: req.user?._id
    });

    if (req.file) {
      circular.fileUrl = getFileUrl(req, 'file');
    }

    const saved = await circular.save();
    res.status(201).json({ message: 'Circular created successfully', circular: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all circulars
// @route   GET /api/circulars
// @access  Private
const getAllCirculars = async (req, res) => {
  try {
    const filter = {};
    if (req.query.session) filter.session = req.query.session;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    
    const circulars = await Circular.find(filter).sort({ createdAt: -1 });
    res.json(circulars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get circular by ID
// @route   GET /api/circulars/:id
// @access  Private
const getCircularById = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id);
    if (!circular) return res.status(404).json({ message: 'Circular not found' });
    res.json(circular);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a circular
// @route   PUT /api/circulars/:id
// @access  Private (Admin)
const updateCircular = async (req, res) => {
  try {
    let data = req.body;
    if (req.body.data) {
       data = JSON.parse(req.body.data);
    }

    const circular = await Circular.findById(req.params.id);
    if (!circular) return res.status(404).json({ message: 'Circular not found' });

    Object.keys(data).forEach(key => {
      circular[key] = data[key];
    });

    if (req.file) {
      circular.fileUrl = getFileUrl(req, 'file');
    }

    const updated = await circular.save();
    res.json({ message: 'Circular updated successfully', circular: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a circular
// @route   DELETE /api/circulars/:id
// @access  Private (Admin)
const deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findByIdAndDelete(req.params.id);
    if (!circular) return res.status(404).json({ message: 'Circular not found' });
    res.json({ message: 'Circular deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCircular,
  getAllCirculars,
  getCircularById,
  updateCircular,
  deleteCircular
};

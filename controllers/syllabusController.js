const Syllabus = require('../models/syllabusModel');
const path = require('path');
const fs = require('fs');

// @desc    Create new syllabus
// @route   POST /api/syllabus
// @access  Private
const createSyllabus = async (req, res) => {
  try {
    const { title, class: className, subject } = req.body;

    if (!title || !className || !subject) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a syllabus file' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const syllabus = new Syllabus({
      title,
      class: className,
      subject,
      fileUrl,
      originalFileName: req.file.originalname,
      // For now, defaulting uploadedBy or using req.admin if auth middleware is in place
      uploadedBy: req.admin ? req.admin.firstName + ' ' + req.admin.lastName : 'Admin'
    });

    const createdSyllabus = await syllabus.save();

    res.status(201).json({
      message: 'Syllabus created successfully',
      syllabus: createdSyllabus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all syllabi
// @route   GET /api/syllabus
// @access  Private
const getSyllabi = async (req, res) => {
  try {
    const { class: className, subject } = req.query;
    
    let query = {};
    if (className) query.class = className;
    if (subject) query.subject = subject;

    const syllabi = await Syllabus.find(query).sort({ createdAt: -1 });
    res.status(200).json(syllabi);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download syllabus file
// @route   GET /api/syllabus/download/:id
// @access  Private
const downloadSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    // Extract filename from fileUrl
    const filename = syllabus.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (fs.existsSync(filePath)) {
      res.download(filePath, syllabus.originalFileName || filename);
    } else {
      res.status(404).json({ message: 'File not found on server' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete syllabus
// @route   DELETE /api/syllabus/:id
// @access  Private
const deleteSyllabus = async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }

    // Extract filename and delete file from server
    if (syllabus.fileUrl) {
      const filename = syllabus.fileUrl.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Syllabus.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Syllabus removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSyllabus,
  getSyllabi,
  downloadSyllabus,
  deleteSyllabus
};

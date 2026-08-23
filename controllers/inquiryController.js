const Inquiry = require('../models/inquiryModel');

// @desc    Create a new admission inquiry
// @route   POST /api/inquiries
// @access  Private (Admin/Admission Manager)
const createInquiry = async (req, res) => {
  try {
    const { parentName, contactNumber, email, childName, classInterested, followUpDate, remarks } = req.body;

    const inquiry = await Inquiry.create({
      parentName,
      contactNumber,
      email,
      childName,
      classInterested,
      followUpDate,
      remarks
    });

    res.status(201).json({ message: 'Inquiry logged successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin/Admission Manager)
const getAllInquiries = async (req, res) => {
  try {
    const { status, classInterested } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (classInterested) query.classInterested = classInterested;

    const inquiries = await Inquiry.find(query).sort('-createdAt');
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single inquiry by ID
// @route   GET /api/inquiries/:id
// @access  Private
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an inquiry
// @route   PUT /api/inquiries/:id
// @access  Private (Admin/Admission Manager)
const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry updated successfully', inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    
    await inquiry.deleteOne();
    res.json({ message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry
};

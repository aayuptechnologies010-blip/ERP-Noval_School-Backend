const Enquiry = require('../models/enquiryModel');

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Private
const createEnquiry = async (req, res) => {
  try {
    const { enquiryNo } = req.body;

    if (!enquiryNo) {
      return res.status(400).json({ message: 'Enquiry No is required' });
    }

    const exists = await Enquiry.findOne({ enquiryNo });

    if (exists) {
      return res.status(400).json({ message: 'Enquiry No already exists' });
    }

    const enquiry = await Enquiry.create(req.body);
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private
const getEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.session) filter.session = req.query.session;
    
    if (req.query.enquiryDate) {
      const startOfDay = new Date(req.query.enquiryDate);
      startOfDay.setUTCHours(0,0,0,0);
      const endOfDay = new Date(req.query.enquiryDate);
      endOfDay.setUTCHours(23,59,59,999);
      filter.enquiryDate = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (req.query.followUpDate) {
      const startOfDay = new Date(req.query.followUpDate);
      startOfDay.setUTCHours(0,0,0,0);
      const endOfDay = new Date(req.query.followUpDate);
      endOfDay.setUTCHours(23,59,59,999);
      filter.nextFollowUpDate = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (req.query.studentDetails) {
      const searchRegex = new RegExp(req.query.studentDetails, 'i');
      filter.$or = [
        { studentName: searchRegex },
        { contactNo: searchRegex },
        { enquiryNo: searchRegex }
      ];
    }
    
    const enquiries = await Enquiry.find(filter)
      .populate('session', 'name')
      .sort({ createdAt: -1 });
      
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get an enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('session', 'name');
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an enquiry
// @route   PUT /api/enquiries/:id
// @access  Private
const updateEnquiry = async (req, res) => {
  try {
    const { enquiryNo } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    if (enquiryNo && enquiryNo !== enquiry.enquiryNo) {
      const exists = await Enquiry.findOne({ enquiryNo });
      if (exists) {
        return res.status(400).json({ message: 'Enquiry No already in use' });
      }
    }

    // Dynamically update fields
    for (const key in req.body) {
      enquiry[key] = req.body[key];
    }

    const updatedEnquiry = await enquiry.save();
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    await enquiry.deleteOne();
    res.status(200).json({ message: 'Enquiry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the last enquiry number
// @route   GET /api/enquiries/last-number/generate
// @access  Private
const getLastEnquiryNumber = async (req, res) => {
  try {
    const lastEnquiry = await Enquiry.findOne().sort({ createdAt: -1 });
    let newEnquiryNo = 'ENQ-0001';
    
    if (lastEnquiry && lastEnquiry.enquiryNo) {
      // Basic logic to increment enquiry number assuming format ENQ-XXXX
      const parts = lastEnquiry.enquiryNo.split('-');
      if (parts.length > 1 && !isNaN(parts[1])) {
        const nextNum = parseInt(parts[1]) + 1;
        newEnquiryNo = `${parts[0]}-${nextNum.toString().padStart(4, '0')}`;
      }
    }
    
    res.status(200).json({ enquiryNo: newEnquiryNo, lastEnquiryNo: lastEnquiry ? lastEnquiry.enquiryNo : null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a follow-up to an enquiry
// @route   POST /api/enquiries/:id/follow-ups
// @access  Private
const addFollowUp = async (req, res) => {
  try {
    const { followUpDate, remark, counsellor, enquiryType, enquiryStatus } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    const newFollowUp = {
      followUpDate,
      remark,
      counsellor,
      enquiryType,
      enquiryStatus
    };

    enquiry.followUps.push(newFollowUp);
    
    // Update top level fields for quick access/filtering
    if (followUpDate) enquiry.nextFollowUpDate = followUpDate;
    if (remark) enquiry.lastRemark = remark;
    if (counsellor) enquiry.counsellor = counsellor;
    if (enquiryType) enquiry.enquiryType = enquiryType;
    if (enquiryStatus) enquiry.enquiryStatus = enquiryStatus;

    const updatedEnquiry = await enquiry.save();
    res.status(200).json(updatedEnquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getLastEnquiryNumber,
  addFollowUp
};

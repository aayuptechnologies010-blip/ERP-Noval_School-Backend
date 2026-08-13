const StaffNotice = require('../models/staffNoticeModel');

// @desc    Create a new staff notice
// @route   POST /api/staff-notices
// @access  Private
const createStaffNotice = async (req, res) => {
  try {
    const { heading, description, isActive } = req.body;

    if (!heading || !description) {
      return res.status(400).json({ message: 'Heading and description are required' });
    }

    const notice = new StaffNotice({
      heading,
      description,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id
    });

    const savedNotice = await notice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff notices (with optional search)
// @route   GET /api/staff-notices
// @access  Private
const getStaffNotices = async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = { isActive: true };

    // Search by heading or description
    if (search) {
      query.$or = [
        { heading: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await StaffNotice.find(query).sort({ updatedAt: -1 });

    // Map notices to include Read/Unread status for the current user
    const formattedNotices = notices.map((notice, index) => {
      const isRead = notice.readBy.includes(req.user._id);
      
      return {
        _id: notice._id,
        srNo: index + 1,
        heading: notice.heading,
        description: notice.description,
        updatedOn: notice.updatedAt,
        status: isRead ? 'Read' : 'Unread'
      };
    });

    res.status(200).json(formattedNotices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single staff notice by ID (and mark as read)
// @route   GET /api/staff-notices/:id
// @access  Private
const getStaffNoticeById = async (req, res) => {
  try {
    const notice = await StaffNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Staff Notice not found' });
    }

    // Mark as read if not already read by this user
    if (!notice.readBy.includes(req.user._id)) {
      notice.readBy.push(req.user._id);
      await notice.save();
    }

    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a staff notice
// @route   PUT /api/staff-notices/:id
// @access  Private
const updateStaffNotice = async (req, res) => {
  try {
    const { heading, description, isActive } = req.body;
    
    const notice = await StaffNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Staff Notice not found' });
    }

    if (heading) notice.heading = heading;
    if (description) notice.description = description;
    if (isActive !== undefined) notice.isActive = isActive;

    const updatedNotice = await notice.save();

    res.status(200).json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a staff notice
// @route   DELETE /api/staff-notices/:id
// @access  Private
const deleteStaffNotice = async (req, res) => {
  try {
    const notice = await StaffNotice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Staff Notice not found' });
    }

    res.status(200).json({ message: 'Staff Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStaffNotice,
  getStaffNotices,
  getStaffNoticeById,
  updateStaffNotice,
  deleteStaffNotice
};

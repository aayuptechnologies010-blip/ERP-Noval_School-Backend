const Notice = require('../models/noticeModel');

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private
const createNotice = async (req, res) => {
  try {
    const { heading, description, isActive } = req.body;

    if (!heading || !description) {
      return res.status(400).json({ message: 'Heading and description are required' });
    }

    const notice = new Notice({
      heading,
      description,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id // Assumes authMiddleware
    });

    const savedNotice = await notice.save();
    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notices (with optional search and status mapping)
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isActive: true }; // Only show active notices by default

    if (search) {
      query.$or = [
        { heading: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await Notice.find(query).sort({ updatedAt: -1 });

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

// @desc    Get a single notice by ID (and mark as read)
// @route   GET /api/notices/:id
// @access  Private
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
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

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private
const updateNotice = async (req, res) => {
  try {
    const { heading, description, isActive } = req.body;
    
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    // Update fields
    if (heading) notice.heading = heading;
    if (description) notice.description = description;
    if (isActive !== undefined) notice.isActive = isActive;

    const updatedNotice = await notice.save();

    res.status(200).json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
};

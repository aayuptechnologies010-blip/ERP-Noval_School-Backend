const ClassNotice = require('../models/classNoticeModel');

// @desc    Create a new class notice
// @route   POST /api/class-notices
// @access  Private
const createClassNotice = async (req, res) => {
  try {
    const { class: className, section, heading, description, isActive } = req.body;

    if (!className || !heading || !description) {
      return res.status(400).json({ message: 'Class, heading, and description are required' });
    }

    const notice = new ClassNotice({
      class: className,
      section: section || null,
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

// @desc    Get all class notices for a specific class/section
// @route   GET /api/class-notices
// @access  Private
const getClassNotices = async (req, res) => {
  try {
    const { class: className, section, search } = req.query;
    
    let query = { isActive: true };
    
    // Filter by class/section if provided
    if (className) query.class = className;
    if (section) query.section = section;

    // Search by heading or description
    if (search) {
      query.$or = [
        { heading: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const notices = await ClassNotice.find(query).sort({ updatedAt: -1 });

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

// @desc    Get a single class notice by ID (and mark as read)
// @route   GET /api/class-notices/:id
// @access  Private
const getClassNoticeById = async (req, res) => {
  try {
    const notice = await ClassNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Class Notice not found' });
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

// @desc    Update a class notice
// @route   PUT /api/class-notices/:id
// @access  Private
const updateClassNotice = async (req, res) => {
  try {
    const { class: className, section, heading, description, isActive } = req.body;
    
    const notice = await ClassNotice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Class Notice not found' });
    }

    if (className) notice.class = className;
    if (section !== undefined) notice.section = section;
    if (heading) notice.heading = heading;
    if (description) notice.description = description;
    if (isActive !== undefined) notice.isActive = isActive;

    const updatedNotice = await notice.save();

    res.status(200).json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a class notice
// @route   DELETE /api/class-notices/:id
// @access  Private
const deleteClassNotice = async (req, res) => {
  try {
    const notice = await ClassNotice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({ message: 'Class Notice not found' });
    }

    res.status(200).json({ message: 'Class Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClassNotice,
  getClassNotices,
  getClassNoticeById,
  updateClassNotice,
  deleteClassNotice
};

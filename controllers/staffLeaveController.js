const StaffLeave = require('../models/staffLeaveModel');
const Staff = require('../models/staffModel');

const toStartOfDay = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const toEndOfDay = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

const STAFF_SELECT = 'firstName lastName designation staffPhoto title';

const createStaffLeave = async (req, res) => {
  try {
    const { staffId, fromDate, toDate, reason } = req.body;

    if (!staffId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: 'staffId, fromDate, toDate, and reason are required.' });
    }

    const staff = await Staff.findById(staffId).select(STAFF_SELECT);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found.' });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) {
      return res.status(400).json({ message: 'toDate cannot be before fromDate.' });
    }

    const leaveRequest = new StaffLeave({
      staffId,
      fromDate: toStartOfDay(fromDate),
      toDate: toEndOfDay(toDate),
      reason,
    });

    const saved = await leaveRequest.save();
    await saved.populate('staffId', STAFF_SELECT);

    res.status(201).json({ message: 'Staff leave request created successfully', leaveRequest: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStaffLeaves = async (req, res) => {
  try {
    const { status, fromDate, toDate, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status && status !== 'All') filter.status = status;

    if (fromDate || toDate) {
      filter.fromDate = {};
      if (fromDate) filter.fromDate.$gte = toStartOfDay(fromDate);
      if (toDate) filter.fromDate.$lte = toEndOfDay(toDate);
    }

    let query = StaffLeave.find(filter)
      .populate('staffId', STAFF_SELECT)
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    let leaveRequests = await query;

    if (search) {
      const searchLower = search.toLowerCase();
      leaveRequests = leaveRequests.filter((lr) => {
        const staff = lr.staffId;
        if (!staff) return false;
        const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.toLowerCase();
        return fullName.includes(searchLower);
      });
    }

    const total = await StaffLeave.countDocuments(filter);

    res.json({ total, page: parseInt(page), limit: parseInt(limit), leaveRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStaffLeaveStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required.' });
    }

    if (!['Approved', 'Rejected', 'Pending', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'status must be Approved, Rejected, Pending, or Cancelled.' });
    }

    const leaveRequest = await StaffLeave.findById(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    leaveRequest.status = status;
    leaveRequest.adminRemarks = adminRemarks || '';
    leaveRequest.reviewedBy = req.user?._id || null;
    leaveRequest.reviewedAt = new Date();

    const updated = await leaveRequest.save();
    await updated.populate('staffId', STAFF_SELECT);
    await updated.populate('reviewedBy', 'firstName lastName');

    res.json({ message: `Staff leave request ${status.toLowerCase()} successfully`, leaveRequest: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStaffLeave = async (req, res) => {
  try {
    const leaveRequest = await StaffLeave.findByIdAndDelete(req.params.id);
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }
    res.json({ message: 'Staff leave request deleted successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStaffLeaveStats = async (req, res) => {
  try {
    const stats = await StaffLeave.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' },
        },
      },
    ]);

    const result = { Pending: 0, Approved: 0, Rejected: 0, Cancelled: 0, Total: 0, approvedLeaveDays: 0 };
    stats.forEach((s) => {
      if (result[s._id] !== undefined) {
        result[s._id] = s.count;
        result.Total += s.count;
        if (s._id === 'Approved') result.approvedLeaveDays = s.totalDays;
      }
    });

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStaffLeave,
  getAllStaffLeaves,
  updateStaffLeaveStatus,
  deleteStaffLeave,
  getStaffLeaveStats,
};

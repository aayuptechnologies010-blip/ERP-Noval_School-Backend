const LeaveRequest = require('../models/leaveRequestModel');
const Student = require('../models/studentModel');

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Set time to start of day (midnight) in UTC
 */
const toStartOfDay = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Set time to end of day in UTC
 */
const toEndOfDay = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

// Student populate select string (reused across functions)
const STUDENT_SELECT =
  'personalDetails.firstName personalDetails.lastName personalDetails.studentPhoto academicDetails.admissionNumber academicDetails.class academicDetails.section academicDetails.rollNumber';

// ─── Controllers ───────────────────────────────────────────────────────────

/**
 * @desc    Create a new leave request for a student
 * @route   POST /api/leave-requests
 * @access  Private (Admin)
 *
 * Body: {
 *   studentId: "...",
 *   fromDate: "2026-08-01",
 *   toDate: "2026-08-02",
 *   reason: "Fever"
 * }
 */
const createLeaveRequest = async (req, res) => {
  try {
    const { studentId, leaveType, fromDate, toDate, reason } = req.body;

    if (!studentId || !leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        message: 'studentId, leaveType, fromDate, toDate, and reason are required.',
      });
    }

    // Validate student exists
    const student = await Student.findById(studentId).select(STUDENT_SELECT);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Validate date range
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) {
      return res.status(400).json({ message: 'toDate cannot be before fromDate.' });
    }

    const leaveRequest = new LeaveRequest({
      studentId,
      leaveType,
      fromDate: toStartOfDay(fromDate),
      toDate: toEndOfDay(toDate),
      reason,
      // Denormalize class/section for fast filtering
      class: student.academicDetails?.class || '',
      section: student.academicDetails?.section || '',
    });

    const saved = await leaveRequest.save();

    // Populate for response
    await saved.populate('studentId', STUDENT_SELECT);

    res.status(201).json({
      message: 'Leave request created successfully',
      leaveRequest: saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all leave requests with optional filters
 * @route   GET /api/leave-requests
 * @query   class, section, status, fromDate, toDate, search (student name / adm no)
 * @access  Private (Admin)
 */
const getAllLeaveRequests = async (req, res) => {
  try {
    const { class: className, section, status, fromDate, toDate, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    // Class filter
    if (className && className !== 'All') filter.class = className;
    if (section && section !== 'All') filter.section = section;

    // Status filter
    if (status && status !== 'All') filter.status = status;

    // Date range filter (on fromDate field of the leave)
    if (fromDate || toDate) {
      filter.fromDate = {};
      if (fromDate) filter.fromDate.$gte = toStartOfDay(fromDate);
      if (toDate) filter.fromDate.$lte = toEndOfDay(toDate);
    }

    let query = LeaveRequest.find(filter)
      .populate('studentId', STUDENT_SELECT)
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));

    let leaveRequests = await query;

    // Search by student name or admission number (post-query filter)
    if (search) {
      const searchLower = search.toLowerCase();
      leaveRequests = leaveRequests.filter((lr) => {
        const student = lr.studentId;
        if (!student) return false;
        const fullName =
          `${student.personalDetails?.firstName || ''} ${student.personalDetails?.lastName || ''}`.toLowerCase();
        const admNo = (student.academicDetails?.admissionNumber || '').toLowerCase();
        return fullName.includes(searchLower) || admNo.includes(searchLower);
      });
    }

    // Total count for pagination
    const total = await LeaveRequest.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      leaveRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a single leave request by ID
 * @route   GET /api/leave-requests/:id
 * @access  Private (Admin)
 */
const getLeaveRequestById = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id)
      .populate('studentId', STUDENT_SELECT)
      .populate('reviewedBy', 'firstName lastName username');

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    res.json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Approve or Reject a leave request
 * @route   PATCH /api/leave-requests/:id/status
 * @access  Private (Admin)
 *
 * Body: { status: "Approved" | "Rejected", adminRemarks: "..." }
 */
const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required (Approved or Rejected).' });
    }

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'status must be Approved, Rejected, or Pending.' });
    }

    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    leaveRequest.status = status;
    leaveRequest.adminRemarks = adminRemarks || '';
    leaveRequest.reviewedBy = req.user?._id || null;
    leaveRequest.reviewedAt = new Date();

    const updated = await leaveRequest.save();
    await updated.populate('studentId', STUDENT_SELECT);
    await updated.populate('reviewedBy', 'firstName lastName');

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leaveRequest: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a leave request
 * @route   DELETE /api/leave-requests/:id
 * @access  Private (Admin)
 */
const deleteLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndDelete(req.params.id);

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    res.json({ message: 'Leave request deleted successfully', leaveRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all leave requests for a specific student
 * @route   GET /api/leave-requests/student/:studentId?status=&year=
 * @access  Private (Admin)
 */
const getStudentLeaveRequests = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, year } = req.query;

    // Validate student exists
    const student = await Student.findById(studentId).select(STUDENT_SELECT);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const filter = { studentId };

    if (status && status !== 'All') filter.status = status;

    if (year) {
      const y = parseInt(year);
      filter.fromDate = {
        $gte: new Date(Date.UTC(y, 0, 1)),
        $lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999)),
      };
    }

    const leaveRequests = await LeaveRequest.find(filter)
      .populate('reviewedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Summary counts
    const summary = { Pending: 0, Approved: 0, Rejected: 0, Total: leaveRequests.length };
    leaveRequests.forEach((lr) => {
      if (summary[lr.status] !== undefined) summary[lr.status]++;
    });

    const totalLeaveDays = leaveRequests
      .filter((lr) => lr.status === 'Approved')
      .reduce((sum, lr) => sum + (lr.totalDays || 0), 0);

    res.json({
      student,
      summary,
      approvedLeaveDays: totalLeaveDays,
      leaveRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get leave request statistics (counts by status)
 *          Optional filters: class, month, year
 * @route   GET /api/leave-requests/stats?class=UKG&month=8&year=2026
 * @access  Private (Admin)
 */
const getLeaveStats = async (req, res) => {
  try {
    const { class: className, month, year } = req.query;

    const filter = {};

    if (className && className !== 'All') filter.class = className;

    if (month && year) {
      const m = parseInt(month);
      const y = parseInt(year);
      filter.fromDate = {
        $gte: new Date(Date.UTC(y, m - 1, 1)),
        $lte: new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)),
      };
    } else if (year) {
      const y = parseInt(year);
      filter.fromDate = {
        $gte: new Date(Date.UTC(y, 0, 1)),
        $lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999)),
      };
    }

    // Aggregate counts per status
    const stats = await LeaveRequest.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' },
        },
      },
    ]);

    // Format result
    const result = { Pending: 0, Approved: 0, Rejected: 0, Total: 0, approvedLeaveDays: 0 };
    stats.forEach((s) => {
      if (result[s._id] !== undefined) {
        result[s._id] = s.count;
        result.Total += s.count;
        if (s._id === 'Approved') result.approvedLeaveDays = s.totalDays;
      }
    });

    // Recent 5 pending requests
    const recentPending = await LeaveRequest.find({ ...filter, status: 'Pending' })
      .populate('studentId', STUDENT_SELECT)
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: result,
      recentPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLeaves = async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'studentId query param is required.' });
    }

    const records = await LeaveRequest.find({ studentId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      records: records.map(r => ({
        id: r._id,
        appliedOn: r.createdAt.toISOString().split('T')[0],
        leaveType: r.leaveType || 'General Leave',
        fromDate: r.fromDate.toISOString().split('T')[0],
        toDate: r.toDate.toISOString().split('T')[0],
        status: r.status,
        reason: r.reason
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ───────────────────────────────────────────────────────────────────────────

module.exports = {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  updateLeaveStatus,
  deleteLeaveRequest,
  getStudentLeaveRequests,
  getLeaveStats,
  getMyLeaves,
};

const StaffAttendance = require('../models/staffAttendanceModel');
const Staff = require('../models/staffModel');

const toMidnightUTC = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const buildSummary = (records) => {
  const summary = { Present: 0, Absent: 0, Leave: 0, HalfDay: 0, Late: 0, NA: 0, Total: 0 };
  records.forEach((r) => {
    if (summary[r.status] !== undefined) summary[r.status]++;
    summary.Total++;
  });
  return summary;
};

const markStaffAttendance = async (req, res) => {
  try {
    const { date, department, records } = req.body;

    if (!date || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: 'date and records[] are required.' });
    }

    const normalizedDate = toMidnightUTC(date);
    const markedBy = req.user?._id || null;

    const ops = records.map((r) => ({
      updateOne: {
        filter: { staffId: r.staffId, date: normalizedDate },
        update: {
          $set: {
            staffId: r.staffId,
            date: normalizedDate,
            department: department || 'All',
            status: r.status,
            remarks: r.remarks || '',
            checkIn: r.checkIn || '',
            checkOut: r.checkOut || '',
            markedBy,
          },
        },
        upsert: true,
      },
    }));

    const result = await StaffAttendance.bulkWrite(ops);

    res.status(200).json({
      message: 'Staff attendance marked successfully',
      date: normalizedDate,
      department: department || 'All',
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: records.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStaffAttendanceByDeptDate = async (req, res) => {
  try {
    const { department, date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'date query param is required.' });
    }

    const normalizedDate = toMidnightUTC(date);
    const filter = { date: normalizedDate };
    
    if (department && department !== 'All Departments' && department !== 'All') {
      filter.department = department;
    }

    const records = await StaffAttendance.find(filter)
      .populate({
        path: 'staffId',
        select: 'firstName lastName userName designation',
      })
      .populate('markedBy', 'firstName lastName')
      .sort({ 'staffId.userName': 1 }); // Sort by userName (EMP-001)

    const summary = buildSummary(records);

    res.json({
      date: normalizedDate,
      department: department || 'All',
      summary,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSingleStaffAttendance = async (req, res) => {
  try {
    const { status, remarks, checkIn, checkOut } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required.' });
    }

    const record = await StaffAttendance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Staff attendance record not found.' });
    }

    record.status = status;
    record.remarks = remarks !== undefined ? remarks : record.remarks;
    record.checkIn = checkIn !== undefined ? checkIn : record.checkIn;
    record.checkOut = checkOut !== undefined ? checkOut : record.checkOut;
    record.markedBy = req.user?._id || record.markedBy;

    const updated = await record.save();

    res.json({ message: 'Staff attendance updated successfully', record: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const { staffId, month, year } = req.query;

    if (!staffId || !month || !year) {
      return res.status(400).json({ message: 'staffId, month, and year query params are required.' });
    }

    // Determine the start and end of the given month
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const filter = {
      staffId,
      date: { $gte: startDate, $lte: endDate }
    };

    const records = await StaffAttendance.find(filter).sort({ date: 1 });

    const summary = buildSummary(records);

    res.json({
      success: true,
      month: `${year}-${month}`,
      summary: {
        totalPresent: summary.Present,
        totalAbsent: summary.Absent,
        totalLeave: summary.Leave,
        totalHalfDay: summary.HalfDay,
        totalLate: summary.Late
      },
      records: records.map(r => ({
        id: r._id,
        date: r.date,
        status: r.status,
        checkIn: r.checkIn || '-',
        checkOut: r.checkOut || '-',
        remarks: r.remarks
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  markStaffAttendance,
  getStaffAttendanceByDeptDate,
  updateSingleStaffAttendance,
  getMyAttendance,
};

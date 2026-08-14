const Attendance = require('../models/attendanceModel');
const Student = require('../models/studentModel');

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Normalise a date to midnight UTC so all queries for the same calendar day
 * always hit the same indexed value.
 */
const toMidnightUTC = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Build a summary object (count of each status) from an array of records.
 */
const buildSummary = (records) => {
  const summary = { Present: 0, Absent: 0, Leave: 0, HalfDay: 0, Late: 0, NA: 0, Total: 0 };
  records.forEach((r) => {
    if (summary[r.status] !== undefined) summary[r.status]++;
    summary.Total++;
  });
  return summary;
};

// ─── Controllers ───────────────────────────────────────────────────────────

/**
 * @desc    Bulk mark / upsert attendance for all students of a class on a date
 * @route   POST /api/attendance/mark
 * @access  Private (Admin)
 *
 * Body: {
 *   date: "2026-08-03",
 *   class: "UKG",
 *   section: "A",
 *   records: [
 *     { studentId: "...", status: "Present", remarks: "" },
 *     { studentId: "...", status: "Absent",  remarks: "Sick" },
 *     ...
 *   ]
 * }
 */
const markAttendance = async (req, res) => {
  try {
    const { date, class: className, section, records } = req.body;

    if (!date || !className || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: 'date, class, and records[] are required.',
      });
    }

    const normalizedDate = toMidnightUTC(date);
    const markedBy = req.user?._id || null;

    // Upsert each record (insert if not exists, update if exists)
    const ops = records.map((r) => ({
      updateOne: {
        filter: { studentId: r.studentId, date: normalizedDate },
        update: {
          $set: {
            studentId: r.studentId,
            date: normalizedDate,
            class: className,
            section: section || '',
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

    const result = await Attendance.bulkWrite(ops);

    res.status(200).json({
      message: 'Attendance marked successfully',
      date: normalizedDate,
      class: className,
      section: section || '',
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: records.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get attendance records for a specific class + section + date
 *          Returns student details along with attendance status
 * @route   GET /api/attendance?class=UKG&section=A&date=2026-08-03
 * @access  Private (Admin)
 */
const getAttendanceByClassDate = async (req, res) => {
  try {
    const { class: className, section, date } = req.query;

    if (!className || !date) {
      return res.status(400).json({ message: 'class and date query params are required.' });
    }

    const normalizedDate = toMidnightUTC(date);

    // Build filter
    const filter = { class: className, date: normalizedDate };
    if (section) filter.section = section;

    const records = await Attendance.find(filter)
      .populate({
        path: 'studentId',
        select: 'personalDetails.firstName personalDetails.lastName personalDetails.studentPhoto academicDetails.admissionNumber academicDetails.rollNumber academicDetails.class academicDetails.section',
      })
      .populate('markedBy', 'firstName lastName')
      .sort({ 'studentId.academicDetails.rollNumber': 1 });

    const summary = buildSummary(records);

    res.json({
      date: normalizedDate,
      class: className,
      section: section || 'All',
      summary,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update a single student's attendance record
 * @route   PUT /api/attendance/:id
 * @access  Private (Admin)
 *
 * Body: { status: "Present", remarks: "..." }
 */
const updateSingleAttendance = async (req, res) => {
  try {
    const { status, remarks, checkIn, checkOut } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required.' });
    }

    const record = await Attendance.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    record.status = status;
    record.remarks = remarks !== undefined ? remarks : record.remarks;
    record.checkIn = checkIn !== undefined ? checkIn : record.checkIn;
    record.checkOut = checkOut !== undefined ? checkOut : record.checkOut;
    record.markedBy = req.user?._id || record.markedBy;

    const updated = await record.save();

    res.json({ message: 'Attendance updated successfully', record: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get a specific student's attendance history
 * @route   GET /api/attendance/student/:studentId?month=8&year=2026
 * @access  Private (Admin)
 */
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month, year } = req.query;

    const filter = { studentId };

    // Optional date range filter
    if (month && year) {
      const startDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
      const endDate = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(Date.UTC(parseInt(year), 0, 1));
      const endDate = new Date(Date.UTC(parseInt(year), 11, 31, 23, 59, 59, 999));
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const student = await Student.findById(studentId).select(
      'personalDetails.firstName personalDetails.lastName personalDetails.studentPhoto academicDetails.admissionNumber academicDetails.rollNumber academicDetails.class academicDetails.section'
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    const summary = buildSummary(records);

    // Calculate attendance percentage
    const workingDays = summary.Total - summary.NA;
    const attendancePercentage =
      workingDays > 0
        ? (((summary.Present + summary.HalfDay * 0.5 + summary.Late) / workingDays) * 100).toFixed(2)
        : '0.00';

    res.json({
      student,
      summary,
      attendancePercentage: `${attendancePercentage}%`,
      totalRecords: records.length,
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get attendance summary (counts) for a class on a date
 * @route   GET /api/attendance/summary?class=UKG&section=A&date=2026-08-03
 * @access  Private (Admin)
 */
const getAttendanceSummary = async (req, res) => {
  try {
    const { class: className, section, date } = req.query;

    if (!className || !date) {
      return res.status(400).json({ message: 'class and date query params are required.' });
    }

    const normalizedDate = toMidnightUTC(date);

    const filter = { class: className, date: normalizedDate };
    if (section) filter.section = section;

    const records = await Attendance.find(filter).select('status');
    const summary = buildSummary(records);

    res.json({ date: normalizedDate, class: className, section: section || 'All', summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get monthly attendance report (matrix) for a class
 *          Returns a list of dates and for each student their status per day
 * @route   GET /api/attendance/report/monthly?class=UKG&section=A&month=8&year=2026
 * @access  Private (Admin)
 */
const getMonthlyReport = async (req, res) => {
  try {
    const { class: className, section, month, year } = req.query;

    if (!className || !month || !year) {
      return res.status(400).json({ message: 'class, month, and year are required.' });
    }

    const m = parseInt(month);
    const y = parseInt(year);

    const startDate = new Date(Date.UTC(y, m - 1, 1));
    const endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));

    const filter = { class: className, date: { $gte: startDate, $lte: endDate } };
    if (section) filter.section = section;

    const records = await Attendance.find(filter)
      .populate({
        path: 'studentId',
        select: 'personalDetails.firstName personalDetails.lastName academicDetails.admissionNumber academicDetails.rollNumber',
      })
      .sort({ date: 1 });

    // Get unique dates (working days)
    const dateSet = new Set(records.map((r) => r.date.toISOString().split('T')[0]));
    const workingDates = Array.from(dateSet).sort();

    // Group by student
    const studentMap = {};
    records.forEach((r) => {
      const sid = r.studentId?._id?.toString();
      if (!sid) return;
      if (!studentMap[sid]) {
        studentMap[sid] = {
          studentId: sid,
          name: `${r.studentId.personalDetails?.firstName || ''} ${r.studentId.personalDetails?.lastName || ''}`.trim(),
          admissionNumber: r.studentId.academicDetails?.admissionNumber || '',
          rollNumber: r.studentId.academicDetails?.rollNumber || '',
          attendance: {},
          summary: { Present: 0, Absent: 0, Leave: 0, HalfDay: 0, Late: 0, NA: 0, Total: 0 },
        };
      }
      const dateKey = r.date.toISOString().split('T')[0];
      studentMap[sid].attendance[dateKey] = { status: r.status, remarks: r.remarks };
      studentMap[sid].summary[r.status]++;
      studentMap[sid].summary.Total++;
    });

    // Calculate percentage for each student
    const students = Object.values(studentMap).map((s) => {
      const working = s.summary.Total - s.summary.NA;
      s.attendancePercentage =
        working > 0
          ? (((s.summary.Present + s.summary.HalfDay * 0.5 + s.summary.Late) / working) * 100).toFixed(2) + '%'
          : '0.00%';
      return s;
    });

    res.json({
      class: className,
      section: section || 'All',
      month: m,
      year: y,
      workingDates,
      totalWorkingDays: workingDates.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get today's overall attendance summary across all classes
 *          Optionally pass ?date=2026-08-09 to query a specific date
 * @route   GET /api/attendance/today
 * @route   GET /api/attendance/today?date=2026-08-09
 * @access  Private (Admin)
 */
const getTodayAttendanceSummary = async (req, res) => {
  try {
    // Allow frontend to pass a specific date; otherwise use server's current date
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();

    // Build start and end of day in UTC
    const startOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0, 0, 0, 0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        23, 59, 59, 999
      )
    );

    // Use range query instead of exact match — much more robust
    const records = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay },
    }).select('class section status');

    // Total overall summary
    const overallSummary = buildSummary(records);

    // Group by class + section
    const classMap = {};
    records.forEach((r) => {
      const key = r.section ? `${r.class} ${r.section}` : r.class;
      if (!classMap[key]) {
        classMap[key] = { class: r.class, section: r.section || '', records: [] };
      }
      classMap[key].records.push(r);
    });

    const classSummaries = Object.values(classMap).map((c) => ({
      class: c.class,
      section: c.section,
      summary: buildSummary(c.records),
    }));

    res.json({
      date: startOfDay,
      overallSummary,
      classSummaries,
      totalClassesCovered: classSummaries.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get distinct dates on which attendance was marked for a class
 * @route   GET /api/attendance/dates?class=UKG&section=A&month=8&year=2026
 * @access  Private (Admin)
 */
const getAttendanceDates = async (req, res) => {
  try {
    const { class: className, section, month, year } = req.query;

    if (!className) {
      return res.status(400).json({ message: 'class is required.' });
    }

    const filter = { class: className };
    if (section) filter.section = section;

    if (month && year) {
      const m = parseInt(month);
      const y = parseInt(year);
      filter.date = {
        $gte: new Date(Date.UTC(y, m - 1, 1)),
        $lte: new Date(Date.UTC(y, m, 0, 23, 59, 59, 999)),
      };
    } else if (year) {
      const y = parseInt(year);
      filter.date = {
        $gte: new Date(Date.UTC(y, 0, 1)),
        $lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999)),
      };
    }

    const dates = await Attendance.distinct('date', filter);
    const sortedDates = dates.map((d) => d.toISOString().split('T')[0]).sort();

    res.json({
      class: className,
      section: section || 'All',
      totalDays: sortedDates.length,
      dates: sortedDates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a specific attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Private (Admin)
 */
const deleteAttendanceRecord = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Attendance record not found.' });
    }

    res.json({ message: 'Attendance record deleted successfully', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ───────────────────────────────────────────────────────────────────────────

const getMyAttendance = async (req, res) => {
  try {
    const { studentId, month, year } = req.query;

    if (!studentId || !month || !year) {
      return res.status(400).json({ message: 'studentId, month, and year query params are required.' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const filter = {
      studentId,
      date: { $gte: startDate, $lte: endDate }
    };

    const records = await Attendance.find(filter).sort({ date: 1 });
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

// ───────────────────────────────────────────────────────────────────────────

module.exports = {
  markAttendance,
  getAttendanceByClassDate,
  updateSingleAttendance,
  getStudentAttendance,
  getAttendanceSummary,
  getMonthlyReport,
  getTodayAttendanceSummary,
  getAttendanceDates,
  deleteAttendanceRecord,
  getMyAttendance,
};

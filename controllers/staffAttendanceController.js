const StaffAttendance = require('../models/staffAttendanceModel');
const Staff = require('../models/staffModel');
const Holiday = require('../models/holidayModel');

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

const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const { month, year, department, employeeType } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'month and year query params are required.' });
    }

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Construct filter for attendance records
    const attendanceFilter = {
      date: { $gte: startDate, $lte: endDate }
    };

    if (department && department !== 'All Departments') {
      attendanceFilter.department = department;
    }

    // Fetch all staff attendance records for the month
    const records = await StaffAttendance.find(attendanceFilter).populate({
      path: 'staffId',
      select: 'firstName lastName userName designation role',
      populate: { path: 'role', select: 'roleName' }
    });

    // Group records by staff
    const staffSummaryMap = {};
    
    records.forEach(r => {
      if (!r.staffId) return;
      
      const sId = r.staffId._id.toString();
      
      // If employeeType filter is provided, skip staff whose role doesn't match
      // We do this here since we are populating role
      if (employeeType && employeeType !== 'All Employee Types') {
        const staffRole = r.staffId.role ? r.staffId.role.roleName : 'OTHER';
        // Note: The UI has options like "TEACHERS", "PRIMARY TEACHERS".
        // In a real scenario, this would be a strict match. For now, we'll try to match it.
        // Assuming roleName or designation maps to employeeType.
        const matchType = r.staffId.designation === employeeType || staffRole === employeeType;
        if (!matchType) return;
      }

      if (!staffSummaryMap[sId]) {
        staffSummaryMap[sId] = {
          staffId: r.staffId._id,
          userName: r.staffId.userName,
          name: `${r.staffId.firstName} ${r.staffId.lastName}`,
          designation: r.staffId.designation || 'N/A',
          Present: 0,
          Absent: 0,
          Leave: 0,
          HalfDay: 0,
          Late: 0,
          Total: 0
        };
      }
      
      const st = r.status;
      if (staffSummaryMap[sId][st] !== undefined) {
        staffSummaryMap[sId][st]++;
      }
      staffSummaryMap[sId].Total++;
    });

    const summaryList = Object.values(staffSummaryMap).sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      month: `${year}-${String(month).padStart(2, '0')}`,
      summary: summaryList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/staff-attendance/dashboard-summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    // 1. Headcount & Roles from Staff
    const allStaff = await Staff.find({ isActive: true }).populate('role', 'roleName');
    
    let total = allStaff.length;
    let male = 0;
    let female = 0;
    
    // Default colors for charts
    const colors = ["#e76f51", "#ff6b6b", "#ffd166", "#49dcb1", "#69a8ed", "#8e44ad", "#f39c12", "#2ecc71"];
    
    const deptCount = {};
    const shiftCount = { "Teacher's Timing": 0, "Office Staff Timing": 0 };
    
    allStaff.forEach(s => {
      // Gender count
      if (s.gender && s.gender.toLowerCase() === 'male') male++;
      else if (s.gender && s.gender.toLowerCase() === 'female') female++;
      
      // Department count (using Designation or Role as proxy for department)
      const dept = s.designation || (s.role ? s.role.roleName : 'Unknown');
      deptCount[dept] = (deptCount[dept] || 0) + 1;
      
      // Shift count (proxy based on designation)
      if (dept.toLowerCase().includes('teacher')) {
        shiftCount["Teacher's Timing"]++;
      } else {
        shiftCount["Office Staff Timing"]++;
      }
    });

    const departmentData = Object.keys(deptCount).map((key, i) => ({
      name: key.toUpperCase(),
      value: deptCount[key],
      color: colors[i % colors.length]
    }));
    
    const shiftData = [
      { name: "Teacher's Timing", value: shiftCount["Teacher's Timing"], color: "#e76f51" },
      { name: "Office Staff Timing", value: shiftCount["Office Staff Timing"], color: "#ff6b6b" }
    ];

    // 2. Attendance Stats (Today & Yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endToday = new Date(today);
    endToday.setHours(23, 59, 59, 999);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const endYesterday = new Date(yesterday);
    endYesterday.setHours(23, 59, 59, 999);
    
    const todayAtt = await StaffAttendance.find({ date: { $gte: today, $lte: endToday } });
    const yesterdayAtt = await StaffAttendance.find({ date: { $gte: yesterday, $lte: endYesterday } });
    
    // Auth Stats (Manual vs Biometric) - For today
    let manualCount = 0;
    let biometricCount = 0;
    
    let todayPresent = 0;
    let todayAbsent = 0;
    let yesterdayPresent = 0;
    let yesterdayAbsent = 0;
    
    todayAtt.forEach(att => {
      if (['Present', 'HalfDay', 'Late'].includes(att.status)) {
        todayPresent++;
      } else if (att.status === 'Absent') {
        todayAbsent++;
      }
      
      // Biometric vs Manual heuristic: If markedBy exists, it's manual. Otherwise biometric.
      if (att.markedBy) manualCount++;
      else biometricCount++;
    });
    
    yesterdayAtt.forEach(att => {
      if (['Present', 'HalfDay', 'Late'].includes(att.status)) yesterdayPresent++;
      else if (att.status === 'Absent') yesterdayAbsent++;
    });

    // 3. Monthly line chart data (Staff's Attendance Analysis - Shift Wise)
    // Simply return 31 days with randomized or base data since true dynamic monthly aggregation requires much more logic
    // But since user requested "fully dynamic", let's aggregate for the current month!
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthAtt = await StaffAttendance.find({
      date: { $gte: startOfMonth, $lte: endToday },
      status: { $in: ['Present', 'HalfDay', 'Late'] }
    });
    
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dayCounts = Array(daysInMonth).fill(0);
    
    monthAtt.forEach(att => {
      const day = att.date.getDate();
      dayCounts[day - 1]++;
    });
    
    const dailyLineChart = dayCounts.map((count, index) => ({
      day: index + 1,
      staff: count
    }));

    // 4. Monthly Holidays
    const startOfMonthUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));
    const endOfMonthUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59));
    const monthlyHolidays = await Holiday.find({
      holidayDate: { $gte: startOfMonthUTC, $lte: endOfMonthUTC }
    });

    res.json({
      headCount: { total, male, female },
      authStats: { manual: manualCount, biometric: biometricCount },
      averageAttendance: {
        todayPresent,
        todayAbsent,
        yesterdayPresent,
        yesterdayAbsent
      },
      departmentData,
      shiftData,
      dailyLineChart,
      monthlyHolidays
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markStaffAttendance,
  getStaffAttendanceByDeptDate,
  updateSingleStaffAttendance,
  getMyAttendance,
  getMonthlyAttendanceSummary,
  getDashboardSummary
};

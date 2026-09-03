const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const StudentAppreciation = require('../models/studentAppreciationModel');
const StaffAppreciation = require('../models/staffAppreciationModel');
const StudentInfraction = require('../models/studentInfractionModel');
const StaffInfraction = require('../models/staffInfractionModel');

// Helper to format response data
const formatBirthdayData = (person, type) => {
  if (type === 'Student') {
    return {
      id: person._id,
      name: `${person.personalDetails.firstName} ${person.personalDetails.lastName}`.trim(),
      type: 'Student',
      class: person.academicDetails?.class || 'N/A',
      dateOfBirth: person.personalDetails.dateOfBirth,
      gender: person.personalDetails.gender || 'N/A',
      photo: person.personalDetails.studentPhoto || ''
    };
  } else {
    return {
      id: person._id,
      name: `${person.title ? person.title + ' ' : ''}${person.firstName} ${person.lastName}`.trim(),
      type: 'Staff',
      class: 'N/A',
      dateOfBirth: person.dob,
      gender: person.gender || 'N/A',
      photo: person.staffPhoto || ''
    };
  }
};

// @desc    Get birthday list (with filters)
// @route   GET /api/reports/birthdays
// @access  Private (Admin)
const getBirthdays = async (req, res) => {
  try {
    const { type, month, search } = req.query; // type: 'Student' or 'Staff' or 'All', month: 1-12, search: text
    
    let students = [];
    let staffs = [];

    // Fetch Students
    if (!type || type === 'All' || type === 'Student') {
      let studentQuery = {};
      
      if (search) {
        studentQuery['$or'] = [
          { 'personalDetails.firstName': { $regex: search, $options: 'i' } },
          { 'personalDetails.lastName': { $regex: search, $options: 'i' } }
        ];
      }
      
      const rawStudents = await Student.find(studentQuery).select('personalDetails academicDetails');
      students = rawStudents.map(s => formatBirthdayData(s, 'Student')).filter(s => s.dateOfBirth != null);
    }

    // Fetch Staff
    if (!type || type === 'All' || type === 'Staff') {
      let staffQuery = {};
      
      if (search) {
        staffQuery['$or'] = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } }
        ];
      }
      
      const rawStaffs = await Staff.find(staffQuery).select('title firstName lastName dob gender staffPhoto');
      staffs = rawStaffs.map(s => formatBirthdayData(s, 'Staff')).filter(s => s.dateOfBirth != null);
    }

    // Combine
    let allBirthdays = [...students, ...staffs];

    // Filter by month if provided (1-12)
    if (month) {
      const monthInt = parseInt(month);
      if (!isNaN(monthInt)) {
        allBirthdays = allBirthdays.filter(person => {
          const personMonth = new Date(person.dateOfBirth).getMonth() + 1; // getMonth is 0-indexed
          return personMonth === monthInt;
        });
      }
    }

    // Sort by Date of Birth (month and day)
    allBirthdays.sort((a, b) => {
      const dateA = new Date(a.dateOfBirth);
      const dateB = new Date(b.dateOfBirth);
      if (dateA.getMonth() !== dateB.getMonth()) {
        return dateA.getMonth() - dateB.getMonth();
      }
      return dateA.getDate() - dateB.getDate();
    });

    res.json(allBirthdays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get month-wise birthday distribution chart data
// @route   GET /api/reports/birthdays/chart
// @access  Private (Admin)
const getBirthdayChart = async (req, res) => {
  try {
    const rawStudents = await Student.find({ 'personalDetails.dateOfBirth': { $ne: null } }).select('personalDetails.dateOfBirth');
    const rawStaffs = await Staff.find({ dob: { $ne: null } }).select('dob');

    // Initialize month counts array (0 = Jan, 11 = Dec)
    const monthCounts = new Array(12).fill(0);

    rawStudents.forEach(s => {
      if (s.personalDetails.dateOfBirth) {
        const m = new Date(s.personalDetails.dateOfBirth).getMonth();
        if (!isNaN(m)) monthCounts[m]++;
      }
    });

    rawStaffs.forEach(s => {
      if (s.dob) {
        const m = new Date(s.dob).getMonth();
        if (!isNaN(m)) monthCounts[m]++;
      }
    });

    const chartData = [
      { month: 'Jan', count: monthCounts[0] },
      { month: 'Feb', count: monthCounts[1] },
      { month: 'Mar', count: monthCounts[2] },
      { month: 'Apr', count: monthCounts[3] },
      { month: 'May', count: monthCounts[4] },
      { month: 'Jun', count: monthCounts[5] },
      { month: 'Jul', count: monthCounts[6] },
      { month: 'Aug', count: monthCounts[7] },
      { month: 'Sep', count: monthCounts[8] },
      { month: 'Oct', count: monthCounts[9] },
      { month: 'Nov', count: monthCounts[10] },
      { month: 'Dec', count: monthCounts[11] }
    ];

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's birthdays (and optionally upcoming)
// @route   GET /api/reports/birthdays/today
// @access  Private (Admin)
const getTodaysBirthdays = async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDate = today.getDate(); // 1-31

    const rawStudents = await Student.find({ 'personalDetails.dateOfBirth': { $ne: null } }).select('personalDetails academicDetails');
    const rawStaffs = await Staff.find({ dob: { $ne: null } }).select('title firstName lastName dob gender staffPhoto');

    const students = rawStudents.map(s => formatBirthdayData(s, 'Student'));
    const staffs = rawStaffs.map(s => formatBirthdayData(s, 'Staff'));

    const allPeople = [...students, ...staffs].filter(p => p.dateOfBirth != null);

    const todaysBirthdays = allPeople.filter(person => {
      const d = new Date(person.dateOfBirth);
      return (d.getMonth() + 1) === currentMonth && d.getDate() === currentDate;
    });

    res.json(todaysBirthdays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appreciation report (with filters for type, date range, search)
// @route   GET /api/reports/appreciations
// @access  Private
const getAppreciationReport = async (req, res) => {
  try {
    const { type, fromDate, toDate, search } = req.query; // type: 'Student', 'Staff', or 'All'
    
    let studentRecords = [];
    let staffRecords = [];

    // Date filters
    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.date = {};
      if (fromDate) dateFilter.date.$gte = new Date(fromDate);
      if (toDate) dateFilter.date.$lte = new Date(toDate);
    }

    // Fetch Student Appreciations
    if (!type || type === 'All' || type === 'Student') {
      const studentQuery = { ...dateFilter };
      if (search) {
        studentQuery.studentName = { $regex: search, $options: 'i' };
      }
      
      const rawStudentApps = await StudentAppreciation.find(studentQuery);
      studentRecords = rawStudentApps.map(app => ({
        id: app._id,
        name: app.studentName,
        type: 'Student',
        classDept: app.studentClass,
        appreciation: app.appreciationType,
        points: app.points,
        date: app.date
      }));
    }

    // Fetch Staff Appreciations
    if (!type || type === 'All' || type === 'Staff') {
      const staffQuery = { ...dateFilter };
      if (search) {
        staffQuery.staffName = { $regex: search, $options: 'i' };
      }
      
      const rawStaffApps = await StaffAppreciation.find(staffQuery);
      staffRecords = rawStaffApps.map(app => ({
        id: app._id,
        name: app.staffName,
        type: 'Staff',
        classDept: app.department || 'N/A',
        appreciation: app.appreciationType,
        points: app.points,
        date: app.date
      }));
    }

    // Combine and Sort by Date (newest first)
    const combinedRecords = [...studentRecords, ...staffRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate Summary
    const totalRecords = combinedRecords.length;
    const totalPoints = combinedRecords.reduce((sum, record) => sum + record.points, 0);
    const studentsCount = studentRecords.length;
    const staffCount = staffRecords.length;

    res.json({
      summary: {
        totalRecords,
        totalPoints,
        studentsCount,
        staffCount
      },
      records: combinedRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get infraction report (with filters for type, date range, search)
// @route   GET /api/reports/infractions
// @access  Private
const getInfractionReport = async (req, res) => {
  try {
    const { type, fromDate, toDate, search } = req.query; // type: 'Student', 'Staff', or 'All'
    
    let studentRecords = [];
    let staffRecords = [];

    // Date filters
    const dateFilter = {};
    if (fromDate || toDate) {
      dateFilter.date = {};
      if (fromDate) dateFilter.date.$gte = new Date(fromDate);
      if (toDate) dateFilter.date.$lte = new Date(toDate);
    }

    // Fetch Student Infractions
    if (!type || type === 'All' || type === 'Student') {
      const studentQuery = { ...dateFilter };
      if (search) {
        studentQuery.studentName = { $regex: search, $options: 'i' };
      }
      
      const rawStudentInfs = await StudentInfraction.find(studentQuery);
      studentRecords = rawStudentInfs.map(inf => ({
        id: inf._id,
        name: inf.studentName,
        type: 'Student',
        classDept: inf.studentClass,
        infraction: inf.infractionType,
        severity: inf.severity,
        consequence: inf.consequence,
        date: inf.date
      }));
    }

    // Fetch Staff Infractions
    if (!type || type === 'All' || type === 'Staff') {
      const staffQuery = { ...dateFilter };
      if (search) {
        staffQuery.staffName = { $regex: search, $options: 'i' };
      }
      
      const rawStaffInfs = await StaffInfraction.find(staffQuery);
      staffRecords = rawStaffInfs.map(inf => ({
        id: inf._id,
        name: inf.staffName,
        type: 'Staff',
        classDept: inf.department || 'N/A',
        infraction: inf.infractionType,
        severity: inf.severity,
        consequence: inf.consequence,
        date: inf.date
      }));
    }

    // Combine and Sort by Date (newest first)
    const combinedRecords = [...studentRecords, ...staffRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate Summary
    const totalRecords = combinedRecords.length;
    const studentsCount = studentRecords.length;
    const staffCount = staffRecords.length;

    res.json({
      summary: {
        totalRecords,
        studentsCount,
        staffCount
      },
      records: combinedRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my infraction records (for a specific student or staff)
// @route   GET /api/reports/my-infractions
// @access  Private
const getMyInfractions = async (req, res) => {
  try {
    const { role, name } = req.query; // role: 'Student' or 'Staff', name: e.g., 'Aarav Sharma'
    
    if (!role || !name) {
      return res.status(400).json({ message: 'Role and name are required to fetch my infractions' });
    }

    let records = [];

    if (role === 'Student') {
      const rawRecords = await StudentInfraction.find({ studentName: { $regex: new RegExp('^' + name + '$', 'i') } }).sort({ date: -1 });
      records = rawRecords.map(inf => ({
        id: inf._id,
        infraction: inf.infractionType,
        severity: inf.severity,
        penaltyPoints: inf.penaltyPoints,
        consequence: inf.consequence,
        date: inf.date,
        status: inf.status,
        notes: inf.notes
      }));
    } else if (role === 'Staff') {
      const rawRecords = await StaffInfraction.find({ staffName: { $regex: new RegExp('^' + name + '$', 'i') } }).sort({ date: -1 });
      records = rawRecords.map(inf => ({
        id: inf._id,
        infraction: inf.infractionType,
        severity: inf.severity,
        penaltyPoints: inf.penaltyPoints,
        consequence: inf.consequence,
        date: inf.date,
        status: inf.status,
        notes: inf.notes
      }));
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Calculate total penalty points accumulated (sum of absolute values as shown in UI)
    const totalPenaltyPoints = records.reduce((sum, record) => sum + Math.abs(record.penaltyPoints || 0), 0);

    res.json({
      totalPenaltyPoints,
      records
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Attendance = require('../models/attendanceModel');
const StaffAttendance = require('../models/staffAttendanceModel');

// @desc    Get attendance report dashboard data
// @route   GET /api/reports/attendance
// @access  Private
const getAttendanceReport = async (req, res) => {
  try {
    const { type, className, date } = req.query; // type: 'Student' or 'Staff', className: 'All Classes' or specific class, date: YYYY-MM-DD
    
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    // 1. Summary Cards
    let totalCount = 0;
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    if (type === 'Student' || !type) {
      let studentQuery = {};
      if (className && className !== 'All Classes') {
        studentQuery['academicDetails.class'] = className;
      }
      totalCount = await Student.countDocuments(studentQuery);

      let attQuery = { date: { $gte: targetDate, $lt: nextDate } };
      if (className && className !== 'All Classes') {
        attQuery.class = className;
      }
      const attendance = await Attendance.find(attQuery);
      
      attendance.forEach(a => {
        if (a.status === 'Present' || a.status === 'HalfDay' || a.status === 'Late') presentCount++;
        else if (a.status === 'Absent') absentCount++;
        else if (a.status === 'Leave') leaveCount++;
      });
    } else if (type === 'Staff') {
      totalCount = await Staff.countDocuments({});
      const attendance = await StaffAttendance.find({ date: { $gte: targetDate, $lt: nextDate } });
      
      attendance.forEach(a => {
        if (a.status === 'Present' || a.status === 'HalfDay' || a.status === 'Late') presentCount++;
        else if (a.status === 'Absent') absentCount++;
        else if (a.status === 'Leave') leaveCount++;
      });
    }

    const presentPercentage = totalCount ? ((presentCount / totalCount) * 100).toFixed(1) : 0;
    const absentPercentage = totalCount ? ((absentCount / totalCount) * 100).toFixed(1) : 0;
    const leavePercentage = totalCount ? ((leaveCount / totalCount) * 100).toFixed(1) : 0;

    // 2. Monthly Chart (Last 5 months)
    const monthlyChart = [];
    const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 4; i >= 0; i--) {
      const d = new Date(targetDate);
      d.setMonth(d.getMonth() - i);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      // Student Monthly
      const studentMonthAtt = await Attendance.find({ date: { $gte: startOfMonth, $lte: endOfMonth } });
      let studentPres = 0;
      studentMonthAtt.forEach(a => { if (['Present', 'HalfDay', 'Late'].includes(a.status)) studentPres++; });
      const studentPerc = studentMonthAtt.length ? ((studentPres / studentMonthAtt.length) * 100).toFixed(1) : 0;

      // Staff Monthly
      const staffMonthAtt = await StaffAttendance.find({ date: { $gte: startOfMonth, $lte: endOfMonth } });
      let staffPres = 0;
      staffMonthAtt.forEach(a => { if (['Present', 'HalfDay', 'Late'].includes(a.status)) staffPres++; });
      const staffPerc = staffMonthAtt.length ? ((staffPres / staffMonthAtt.length) * 100).toFixed(1) : 0;

      monthlyChart.push({
        month: monthsStr[d.getMonth()],
        studentPercentage: parseFloat(studentPerc),
        staffPercentage: parseFloat(staffPerc)
      });
    }

    // 3. Class-wise Chart (Only if type is Student)
    const classWiseChart = [];
    if (type === 'Student' || !type) {
      const classAtt = await Attendance.aggregate([
        { $match: { date: { $gte: targetDate, $lt: nextDate } } },
        {
          $group: {
            _id: '$class',
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $in: ['$status', ['Present', 'HalfDay', 'Late']] }, 1, 0] } },
            absent: { $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      classAtt.forEach(c => {
        classWiseChart.push({
          className: c._id,
          presentPercentage: c.total ? parseFloat(((c.present / c.total) * 100).toFixed(1)) : 0,
          absentPercentage: c.total ? parseFloat(((c.absent / c.total) * 100).toFixed(1)) : 0
        });
      });
    }

    res.json({
      summary: {
        totalCount,
        presentCount,
        presentPercentage: parseFloat(presentPercentage),
        absentCount,
        absentPercentage: parseFloat(absentPercentage),
        leaveCount,
        leavePercentage: parseFloat(leavePercentage)
      },
      monthlyChart,
      classWiseChart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get average attendance analysis report
// @route   GET /api/reports/average-attendance
// @access  Private
const getAverageAttendanceAnalysis = async (req, res) => {
  try {
    const { fromMonth, toMonth } = req.query; // format: 'YYYY-MM'
    
    // Default to last 6 months if not provided
    let startDate, endDate;
    if (fromMonth && toMonth) {
      startDate = new Date(`${fromMonth}-01T00:00:00.000Z`);
      const [year, month] = toMonth.split('-');
      endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // last day of toMonth
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 5);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    // 1. Get all students and group by class for counts
    const students = await Student.find({}).select('academicDetails.class');
    const classStudentCounts = {};
    students.forEach(s => {
      const className = s.academicDetails?.class;
      if (className) {
        classStudentCounts[className] = (classStudentCounts[className] || 0) + 1;
      }
    });

    const classes = Object.keys(classStudentCounts).sort();

    // 2. Fetch all attendance in the date range
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    // 3. Process Trend Chart (Month-wise)
    const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthWiseData = {};
    const classDailyData = {}; // For calculating highest/lowest

    attendanceRecords.forEach(att => {
      const monthName = monthsStr[att.date.getMonth()];
      const className = att.class;
      const dateStr = att.date.toISOString().split('T')[0];

      // Trend data init
      if (!monthWiseData[monthName]) monthWiseData[monthName] = {};
      if (!monthWiseData[monthName][className]) monthWiseData[monthName][className] = { present: 0, total: 0 };
      
      // Daily data init (for highest/lowest)
      if (!classDailyData[className]) classDailyData[className] = {};
      if (!classDailyData[className][dateStr]) classDailyData[className][dateStr] = { present: 0, total: 0 };

      // Count
      monthWiseData[monthName][className].total++;
      classDailyData[className][dateStr].total++;
      if (['Present', 'HalfDay', 'Late'].includes(att.status)) {
        monthWiseData[monthName][className].present++;
        classDailyData[className][dateStr].present++;
      }
    });

    // Format Trend Chart
    const trendChart = [];
    let curr = new Date(startDate);
    // Add 12:00 to avoid timezone issues when moving months
    curr.setHours(12, 0, 0, 0); 
    while (curr <= endDate || (curr.getMonth() === endDate.getMonth() && curr.getFullYear() === endDate.getFullYear())) {
      const mName = monthsStr[curr.getMonth()];
      if (!trendChart.find(t => t.month === mName)) {
        const monthEntry = { month: mName };
        classes.forEach(cls => {
          const mData = monthWiseData[mName]?.[cls];
          monthEntry[cls] = mData && mData.total > 0 ? parseFloat(((mData.present / mData.total) * 100).toFixed(1)) : null;
        });
        trendChart.push(monthEntry);
      }
      curr.setMonth(curr.getMonth() + 1);
    }

    // 4. Process Class-wise Summary & Radar
    const classSummary = [];
    const radarChart = [];

    classes.forEach(cls => {
      const studentsCount = classStudentCounts[cls];
      
      let totalPresent = 0;
      let totalRecords = 0;
      let highest = 0;
      let lowest = 100;
      let hasData = false;

      const dailyData = classDailyData[cls];
      if (dailyData) {
        Object.values(dailyData).forEach(day => {
          if (day.total > 0) {
            hasData = true;
            totalRecords += day.total;
            totalPresent += day.present;
            const dayPerc = (day.present / day.total) * 100;
            if (dayPerc > highest) highest = dayPerc;
            if (dayPerc < lowest) lowest = dayPerc;
          }
        });
      }

      if (!hasData) lowest = 0; // reset if no data

      const avgPercentage = totalRecords > 0 ? parseFloat(((totalPresent / totalRecords) * 100).toFixed(1)) : 0;
      highest = parseFloat(highest.toFixed(1));
      lowest = parseFloat(lowest.toFixed(1));

      classSummary.push({
        className: cls,
        studentsCount,
        avgPercentage,
        highest,
        lowest
      });

      radarChart.push({
        className: cls,
        avgPercentage
      });
    });

    res.json({
      trendChart,
      classSummary,
      radarChart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Timetable = require('../models/timetableModel');

// @desc    Get Teachers Workload report
// @route   GET /api/reports/teachers-workload
// @access  Private
const getTeachersWorkload = async (req, res) => {
  try {
    const { month } = req.query; // optional month filter

    // Fetch all timetables and populate teacher details
    const timetables = await Timetable.find().populate('schedule.periods.teacher', 'title firstName lastName');

    const teacherStats = {};

    timetables.forEach(tt => {
      tt.schedule.forEach(daySchedule => {
        daySchedule.periods.forEach(period => {
          if (!period.isBreak && period.teacher) {
            const tId = period.teacher._id.toString();
            if (!teacherStats[tId]) {
              teacherStats[tId] = {
                id: tId,
                name: `${period.teacher.title ? period.teacher.title + ' ' : ''}${period.teacher.firstName} ${period.teacher.lastName}`.trim(),
                weeklyPeriods: 0,
                classesHandled: new Set(),
                subjects: new Set()
              };
            }
            teacherStats[tId].weeklyPeriods++;
            teacherStats[tId].classesHandled.add(`${tt.class}-${tt.section}`);
            if (period.subject) {
              teacherStats[tId].subjects.add(period.subject);
            }
          }
        });
      });
    });

    const MAX_PERIODS_PER_MONTH = 90; // Threshold for overload
    
    let totalTeachers = 0;
    let totalPeriodsAssigned = 0;
    let overloadedTeachersCount = 0;

    const tableData = [];
    const periodsPerTeacherChart = [];
    const workloadDistribution = [];

    Object.values(teacherStats).forEach(stat => {
      totalTeachers++;
      const monthlyPeriods = stat.weeklyPeriods * 4; // approximate month
      totalPeriodsAssigned += monthlyPeriods;

      const overload = Math.max(0, monthlyPeriods - MAX_PERIODS_PER_MONTH);
      if (overload > 0) {
        overloadedTeachersCount++;
      }

      // Format subjects (take the first one or join)
      const subjectArr = Array.from(stat.subjects);
      const mainSubject = subjectArr.length > 0 ? subjectArr[0] : 'General';

      tableData.push({
        id: stat.id,
        teacherName: stat.name,
        subject: mainSubject,
        classesHandled: stat.classesHandled.size,
        periods: monthlyPeriods,
        overloadPeriods: overload,
        status: overload > 0 ? 'Overloaded' : 'Normal'
      });

      // Using short name for charts (firstName)
      const shortName = stat.name.split(' ').pop() || stat.name;

      periodsPerTeacherChart.push({
        teacher: shortName,
        assignedPeriods: monthlyPeriods,
        overload: overload
      });
    });

    // Calculate Workload Distribution (Pie Chart) %
    tableData.forEach(td => {
      const shortName = td.teacherName.split(' ').pop() || td.teacherName;
      const percentage = totalPeriodsAssigned > 0 ? Math.round((td.periods / totalPeriodsAssigned) * 100) : 0;
      workloadDistribution.push({
        name: shortName,
        value: percentage
      });
    });

    const avgPeriodsPerTeacher = totalTeachers > 0 ? Math.round(totalPeriodsAssigned / totalTeachers) : 0;

    res.json({
      summary: {
        totalTeachers,
        totalPeriodsAssigned,
        avgPeriodsPerTeacher,
        overloadedTeachers: overloadedTeachersCount
      },
      periodsPerTeacherChart,
      workloadDistribution,
      tableData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Conversation = require('../models/conversationModel');

// @desc    Get Conversation Report Data
// @route   GET /api/reports/conversations
// @access  Private
const getConversationReport = async (req, res) => {
  try {
    const { search, status } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { topic: { $regex: search, $options: 'i' } },
        { sender: { $regex: search, $options: 'i' } },
        { receiver: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // Fetch conversations (with filters for table)
    const tableRecords = await Conversation.find(query).sort({ date: -1 });

    // Fetch all for dashboard stats regardless of the table filters
    // Or normally, dashboard filters apply to everything. We'll apply filters to everything.
    const allConversations = await Conversation.find({});

    // 1. Summary Cards
    const totalThreads = allConversations.length;
    let resolvedCount = 0;
    let openCount = 0;
    let pendingReviewCount = 0;

    allConversations.forEach(c => {
      if (c.status === 'Resolved') resolvedCount++;
      else if (c.status === 'Open') openCount++;
      else if (c.status === 'Pending Review') pendingReviewCount++;
    });

    const pendingAction = openCount + pendingReviewCount;

    // 2. Status Breakdown
    const statusBreakdown = [
      { name: 'Open', value: openCount },
      { name: 'Pending Review', value: pendingReviewCount },
      { name: 'Resolved', value: resolvedCount }
    ];

    // 3. Weekly Activity Trend
    const weeklyTrend = [];
    const daysStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Get last 7 days starting from today backwards
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = daysStr[d.getDay()];
      
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      let count = 0;
      allConversations.forEach(c => {
        if (c.date >= startOfDay && c.date <= endOfDay) {
          count++;
        }
      });

      weeklyTrend.push({
        day: dayName,
        count: count
      });
    }

    // Format table records
    const formattedTableData = tableRecords.map(r => ({
      id: r._id,
      topic: r.topic,
      sender: r.sender,
      receiver: r.receiver,
      date: r.date.toISOString().split('T')[0],
      status: r.status
    }));

    res.json({
      summary: {
        totalThreads,
        resolved: resolvedCount,
        pendingAction
      },
      statusBreakdown,
      weeklyTrend,
      tableData: formattedTableData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LessonPlan = require('../models/lessonPlanModel');

// @desc    Get Lesson Plan Report Data
// @route   GET /api/reports/lesson-plans
// @access  Private
const getLessonPlanReport = async (req, res) => {
  try {
    const { search, subject, className } = req.query;

    let query = {};

    if (subject && subject !== 'All') {
      query.subject = subject;
    }
    if (className && className !== 'All') {
      query.class = className;
    }

    const records = await LessonPlan.find(query).populate('createdBy', 'title firstName lastName name').sort({ date: -1 });

    let finalRecords = [];
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    records.forEach(r => {
      let teacherName = 'N/A';
      if (r.createdBy) {
         if (r.createdBy.firstName) {
            teacherName = `${r.createdBy.title ? r.createdBy.title + ' ' : ''}${r.createdBy.firstName} ${r.createdBy.lastName || ''}`.trim();
         } else if (r.createdBy.name) {
            teacherName = r.createdBy.name;
         }
      }

      // Apply search filter (Topic OR Teacher)
      if (search) {
        const searchLower = search.toLowerCase();
        if (!r.topic.toLowerCase().includes(searchLower) && !teacherName.toLowerCase().includes(searchLower)) {
          return; // Skip this record
        }
      }

      if (r.status === 'Completed') completed++;
      else if (r.status === 'In Progress') inProgress++;
      else if (r.status === 'Pending') pending++;

      finalRecords.push({
        id: r._id,
        topic: r.topic,
        subject: r.subject,
        teacher: teacherName,
        class: r.class,
        duration: r.duration,
        date: r.date.toISOString().split('T')[0],
        status: r.status
      });
    });

    res.json({
      summary: {
        totalPlans: finalRecords.length,
        completed,
        inProgress,
        pending
      },
      records: finalRecords
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const QuestionPaper = require('../models/questionPaperModel');
const Survey = require('../models/surveyModel');
const SmsLog = require('../models/smsLogModel');
const SmsRecharge = require('../models/smsRechargeModel');
const Fee = require('../models/feeModel');

// ─── MISSING ATTENDANCE ────────────────────────────────────────────────────
// @route GET /api/reports/missing-attendance
const getMissingAttendanceReport = async (req, res) => {
  try {
    const { date, className } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    // Get all classes that have timetables (teachers assigned)
    const Timetable = require('../models/timetableModel');
    let ttQuery = {};
    if (className && className !== 'All') ttQuery.class = className;
    const timetables = await Timetable.find(ttQuery).populate('schedule.periods.teacher', 'title firstName lastName');

    // Get existing attendance records for that date
    const existingAttendance = await Attendance.find({
      date: { $gte: dayStart, $lte: dayEnd }
    }).distinct('class');

    const missingList = [];
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][targetDate.getDay()];

    timetables.forEach(tt => {
      const classKey = `${tt.class}${tt.section ? '-' + tt.section : ''}`;
      const hasAttendance = existingAttendance.some(cls => cls === tt.class || cls === classKey);

      if (!hasAttendance) {
        const daySchedule = tt.schedule.find(s => s.day === dayOfWeek);
        if (daySchedule && daySchedule.periods.length > 0) {
          const firstTeacherPeriod = daySchedule.periods.find(p => !p.isBreak && p.teacher);
          missingList.push({
            id: tt._id,
            class: classKey,
            teacher: firstTeacherPeriod?.teacher
              ? `${firstTeacherPeriod.teacher.title ? firstTeacherPeriod.teacher.title + ' ' : ''}${firstTeacherPeriod.teacher.firstName} ${firstTeacherPeriod.teacher.lastName}`.trim()
              : 'Not Assigned',
            subject: firstTeacherPeriod?.subject || 'N/A',
            period: '1st Period',
            date: targetDate.toISOString().split('T')[0],
            status: 'Pending'
          });
        }
      }
    });

    res.json({ total: missingList.length, date: targetDate.toISOString().split('T')[0], records: missingList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── STATISTICAL REPORT ───────────────────────────────────────────────────
// @route GET /api/reports/statistical
const getStatisticalReport = async (req, res) => {
  try {
    const students = await Student.find({}).select('personalDetails.gender academicDetails.class');
    const staff = await Staff.find({}).select('designation');

    const totalStudents = students.length;
    const boys = students.filter(s => s.personalDetails?.gender === 'Male').length;
    const girls = students.filter(s => s.personalDetails?.gender === 'Female').length;

    const totalStaff = staff.length;
    // Heuristic: if designation contains 'teach' or 'teacher', mark as Teaching
    const teachingStaff = staff.filter(s => (s.designation || '').toLowerCase().includes('teach')).length;
    const nonTeachingStaff = totalStaff - teachingStaff;

    // Class-wise student count
    const classWise = {};
    students.forEach(s => {
      const cls = s.academicDetails?.class || 'Unknown';
      classWise[cls] = (classWise[cls] || 0) + 1;
    });
    const classWiseData = Object.entries(classWise).map(([cls, count]) => ({ class: cls, count })).sort((a, b) => a.class.localeCompare(b.class));

    res.json({
      students: {
        total: totalStudents,
        boys,
        girls,
        data: [
          { name: 'Boys', value: boys, color: '#f59e0b' },
          { name: 'Girls', value: girls, color: '#3b82f6' }
        ]
      },
      staff: {
        total: totalStaff,
        teaching: teachingStaff,
        nonTeaching: nonTeachingStaff,
        data: [
          { name: 'Teaching', value: teachingStaff, color: '#10b981' },
          { name: 'Non-Teaching', value: nonTeachingStaff, color: '#8b5cf6' }
        ]
      },
      classWise: classWiseData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── APP USERS REPORT ─────────────────────────────────────────────────────
// @route GET /api/reports/app-users
const getAppUsersReport = async (req, res) => {
  try {
    const students = await Student.find({}).select('personalDetails.firstName personalDetails.lastName personalDetails.gender academicDetails.class academicDetails.section personalDetails.fatherDetails.mobileNo academicDetails.admissionNo');

    const total = students.length;
    // In absence of real app registration data, classify as "Remaining" (not on app)
    // This can be updated when a real app flag is added to the student model
    const androidUsers = [];
    const remaining = students.map((s, i) => ({
      id: s._id,
      name: `${s.personalDetails?.firstName || ''} ${s.personalDetails?.lastName || ''}`.trim(),
      father: `Mr. ${s.personalDetails?.fatherDetails?.fatherName || 'N/A'}`,
      gender: s.personalDetails?.gender || 'N/A',
      admissionNo: s.academicDetails?.admissionNo || String(i + 1),
      className: `${s.academicDetails?.class || ''}${s.academicDetails?.section ? '-' + s.academicDetails.section : ''}`,
      mobile: s.personalDetails?.fatherDetails?.mobileNo || 'N/A'
    }));

    res.json({
      summary: {
        total,
        android: androidUsers.length,
        ios: 0,
        remaining: remaining.length
      },
      donutData: [
        { name: 'Android', value: androidUsers.length, color: '#10b981', percent: total > 0 ? `${((androidUsers.length / total) * 100).toFixed(2)}%` : '0%' },
        { name: 'IOS', value: 0, color: '#8b5cf6', percent: '0%' },
        { name: 'Remaining', value: remaining.length, color: '#fb7185', percent: total > 0 ? `${((remaining.length / total) * 100).toFixed(2)}%` : '100%' }
      ],
      androidUsers,
      remainingUsers: remaining
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── QUESTION PAPER REPORT ────────────────────────────────────────────────
// @route GET /api/reports/question-papers
const getQuestionPaperReport = async (req, res) => {
  try {
    const { className, subject, status } = req.query;
    let query = {};
    if (className && className !== 'All') query.class = className;
    if (subject && subject !== 'All') query.subject = subject;
    if (status && status !== 'All') query.status = status;

    const papers = await QuestionPaper.find(query).sort({ date: -1 });

    const total = papers.length;
    const published = papers.filter(p => p.status === 'Published').length;
    const drafts = papers.filter(p => p.status === 'Draft').length;

    const records = papers.map(p => ({
      id: p._id,
      title: p.title,
      subject: p.subject,
      class: p.class,
      teacher: p.teacher,
      totalMarks: p.totalMarks,
      duration: p.duration,
      date: p.date ? p.date.toISOString().split('T')[0] : '',
      status: p.status
    }));

    res.json({ summary: { total, published, drafts }, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SURVEY REPORT ────────────────────────────────────────────────────────
// @route GET /api/reports/surveys
const getSurveyReport = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.isActive = status === 'Active';
    }

    const surveys = await Survey.find(query).populate('createdBy', 'firstName lastName').sort({ createdAt: -1 });

    const total = await Survey.countDocuments({});
    const active = await Survey.countDocuments({ isActive: true });
    const completed = await Survey.countDocuments({ isActive: false });

    const records = surveys.map(s => ({
      id: s._id,
      title: s.title,
      description: s.description || '',
      audience: 'All',
      questions: s.questions?.length || 0,
      status: s.isActive ? 'Active' : 'Completed',
      deadline: s.deadline ? new Date(s.deadline).toISOString().split('T')[0] : null,
      createdBy: s.createdBy ? `${s.createdBy.firstName || ''} ${s.createdBy.lastName || ''}`.trim() : 'Admin',
      date: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : ''
    }));

    res.json({ summary: { total, active, completed }, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SMS REPORT ──────────────────────────────────────────────────────────
// @route GET /api/reports/sms/report
const getSMSReport = async (req, res) => {
  try {
    const { fromDate, toDate, type } = req.query;
    let query = {};
    if (fromDate && toDate) {
      query.createdAt = { $gte: new Date(fromDate), $lte: new Date(new Date(toDate).setHours(23,59,59,999)) };
    }
    if (type && type !== 'All') query.type = type;

    const logs = await SmsLog.find(query).sort({ createdAt: -1 });

    const totalSent = logs.reduce((s, l) => s + (l.count || 1), 0);
    const delivered = logs.filter(l => l.status === 'Delivered').reduce((s, l) => s + (l.count || 1), 0);
    const failed = logs.filter(l => l.status === 'Failed').reduce((s, l) => s + (l.count || 1), 0);
    const pending = logs.filter(l => l.status === 'Pending').reduce((s, l) => s + (l.count || 1), 0);

    const statusBreakdown = [
      { name: 'Delivered', value: delivered, color: '#10b981' },
      { name: 'Failed', value: failed, color: '#ef4444' },
      { name: 'Pending', value: pending, color: '#f59e0b' }
    ];

    const records = logs.map(l => ({
      id: l._id,
      date: l.createdAt.toISOString().split('T')[0],
      type: l.type,
      sentTo: l.sentTo,
      message: l.message,
      count: l.count,
      status: l.status
    }));

    res.json({ summary: { totalSent, delivered, failed, pending }, statusBreakdown, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SMS CONSUMPTION ─────────────────────────────────────────────────────
// @route GET /api/reports/sms/consumption
const getSMSConsumption = async (req, res) => {
  try {
    const logs = await SmsLog.find({}).sort({ createdAt: -1 });

    const totalCreditsUsed = logs.reduce((s, l) => s + (l.creditsUsed || 1), 0);

    // Monthly breakdown
    const monthly = {};
    logs.forEach(l => {
      const mo = l.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthly[mo] = (monthly[mo] || 0) + (l.creditsUsed || 1);
    });
    const monthlyChart = Object.entries(monthly).map(([month, credits]) => ({ month, credits })).slice(-6);

    const records = logs.slice(0, 100).map(l => ({
      id: l._id,
      date: l.createdAt.toISOString().split('T')[0],
      type: l.type,
      sentTo: l.sentTo,
      count: l.count,
      creditsUsed: l.creditsUsed || l.count,
      status: l.status
    }));

    res.json({ summary: { totalCreditsUsed }, monthlyChart, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SMS RECHARGE LOG ─────────────────────────────────────────────────────
// @route GET /api/reports/sms/recharge
const getSMSRechargeLog = async (req, res) => {
  try {
    const recharges = await SmsRecharge.find({}).populate('rechargedBy', 'firstName lastName').sort({ createdAt: -1 });

    const totalCredits = recharges.reduce((s, r) => s + (r.credits || 0), 0);
    const totalAmount = recharges.reduce((s, r) => s + (r.amount || 0), 0);

    const records = recharges.map(r => ({
      id: r._id,
      date: r.createdAt.toISOString().split('T')[0],
      credits: r.credits,
      amount: r.amount,
      validity: r.validity ? r.validity.toISOString().split('T')[0] : 'N/A',
      status: r.status,
      transactionId: r.transactionId || 'N/A',
      rechargedBy: r.rechargedBy ? `${r.rechargedBy.firstName || ''} ${r.rechargedBy.lastName || ''}`.trim() : 'Admin'
    }));

    res.json({ summary: { totalCredits, totalAmount, totalRecharges: recharges.length }, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── SMS USES (Module-wise) ──────────────────────────────────────────────
// @route GET /api/reports/sms/uses
const getSMSUses = async (req, res) => {
  try {
    const logs = await SmsLog.find({});

    const moduleUsage = {};
    logs.forEach(l => {
      const mod = l.module || 'Manual';
      if (!moduleUsage[mod]) moduleUsage[mod] = { module: mod, count: 0, creditsUsed: 0 };
      moduleUsage[mod].count += l.count || 1;
      moduleUsage[mod].creditsUsed += l.creditsUsed || 1;
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];
    const records = Object.values(moduleUsage).map((m, i) => ({ ...m, color: COLORS[i % COLORS.length] }));

    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── APP MESSAGE USES ────────────────────────────────────────────────────
// @route GET /api/reports/app-message/uses
const getAppMessageUses = async (req, res) => {
  try {
    const Message = require('../models/messageModel');
    const messages = await Message.find({}).sort({ createdAt: -1 }).limit(200);

    const total = messages.length;

    // Group by sender type
    const monthly = {};
    messages.forEach(m => {
      const mo = m.createdAt.toISOString().substring(0, 7);
      monthly[mo] = (monthly[mo] || 0) + 1;
    });
    const monthlyChart = Object.entries(monthly).map(([month, count]) => ({ month, count })).slice(-6);

    res.json({ summary: { total }, monthlyChart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Undertaking Acknowledgement Report
// @route   GET /api/reports/undertaking
// @access  Private
const getUndertakingReport = async (req, res) => {
  try {
    // Dummy response since no Undertaking model exists yet
    const records = [
      { id: 1, studentName: 'Aarav Sharma', class: '10 A', parentName: 'Rajesh Sharma', status: 'Acknowledged', date: '2026-09-01' },
      { id: 2, studentName: 'Priya Mehta', class: '8 B', parentName: 'Sunil Mehta', status: 'Pending', date: null },
      { id: 3, studentName: 'Rohan Gupta', class: '12 Science', parentName: 'Amit Gupta', status: 'Acknowledged', date: '2026-09-02' }
    ];
    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBirthdays,
  getBirthdayChart,
  getTodaysBirthdays,
  getAppreciationReport,
  getInfractionReport,
  getMyInfractions,
  getAttendanceReport,
  getAverageAttendanceAnalysis,
  getTeachersWorkload,
  getConversationReport,
  getLessonPlanReport,
  getMissingAttendanceReport,
  getStatisticalReport,
  getAppUsersReport,
  getQuestionPaperReport,
  getSurveyReport,
  getSMSReport,
  getSMSConsumption,
  getSMSRechargeLog,
  getSMSUses,
  getAppMessageUses,
  getUndertakingReport
};


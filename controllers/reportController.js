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

module.exports = {
  getBirthdays,
  getBirthdayChart,
  getTodaysBirthdays,
  getAppreciationReport,
  getInfractionReport,
  getMyInfractions
};

const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const LeaveRequest = require('../models/leaveRequestModel');
const StaffLeave = require('../models/staffLeaveModel');
const Message = require('../models/messageModel');
const Notice = require('../models/noticeModel');
const Circular = require('../models/circularModel');
const Questionnaire = require('../models/questionnaireModel');
const Thought = require('../models/thoughtModel');
const StaffAttendance = require('../models/staffAttendanceModel');
const Fee = require('../models/feeModel');
const Activity = require('../models/activityModel');
const Book = require('../models/bookModel');

// @desc    Get aggregated dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const [
      students, staff, studentLeaves, staffLeaves,
      messages, notices, circulars,
      questionnaires, thoughts,
      staffAttendance
    ] = await Promise.all([
      Student.find({}).select('personalDetails.gender personalDetails.religion personalDetails.caste personalDetails.dateOfBirth academicDetails.admissionNumber academicDetails.dateOfAdmission academicDetails.class academicDetails.section academicDetails.currentStatus'),
      Staff.find({}).select('gender firstName lastName dob'),
      LeaveRequest.countDocuments({ status: 'Pending' }),
      StaffLeave.countDocuments({ status: 'Pending' }),
      Message.countDocuments(),
      Notice.countDocuments(),
      Circular.countDocuments(),
      Questionnaire.countDocuments(),
      Thought.countDocuments(),
      StaffAttendance.find({ staff: req.user._id })
    ]);

    // Student calculations
    const totalStudents = students.length;
    const boysCount = students.filter(s => s.personalDetails?.gender === 'Male').length;
    const girlsCount = students.filter(s => s.personalDetails?.gender === 'Female').length;
    
    // New Admission (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newAdmissions = students.filter(s => {
      if (!s.academicDetails?.dateOfAdmission) return false;
      return new Date(s.academicDetails.dateOfAdmission) >= thirtyDaysAgo;
    }).length;

    // Staff calculations
    const totalStaff = staff.length;
    const maleStaff = staff.filter(s => s.gender === 'Male').length;
    const femaleStaff = staff.filter(s => s.gender === 'Female').length;

    // My Attendance
    let myAttendancePercent = '0%';
    if (staffAttendance.length > 0) {
      const present = staffAttendance.filter(a => a.status === 'Present').length;
      myAttendancePercent = Math.round((present / staffAttendance.length) * 100) + '%';
    }

    // ─── Standard-wise / Student Status (Studying vs Left) ───
    const studyingCount = students.filter(s => (s.academicDetails?.currentStatus || '').toUpperCase() === 'STUDYING').length;
    const leftCount = totalStudents - studyingCount;

    // ─── Admission Statistics (class-wise, current year vs previous year) ───
    const now = new Date();
    const currentAcademicYearStart = now.getMonth() >= 3 ? new Date(now.getFullYear(), 3, 1) : new Date(now.getFullYear() - 1, 3, 1);
    const prevAcademicYearStart = new Date(currentAcademicYearStart.getFullYear() - 1, 3, 1);
    const prevAcademicYearEnd = new Date(currentAcademicYearStart.getFullYear(), 2, 31);

    const classNames = [...new Set(students.map(s => s.academicDetails?.class).filter(Boolean))].sort();
    const admissionStats = classNames.map(cls => {
      const currentYear = students.filter(s => {
        const d = s.academicDetails?.dateOfAdmission;
        return s.academicDetails?.class === cls && d && new Date(d) >= currentAcademicYearStart;
      }).length;
      const prevYear = students.filter(s => {
        const d = s.academicDetails?.dateOfAdmission;
        return s.academicDetails?.class === cls && d && new Date(d) >= prevAcademicYearStart && new Date(d) <= prevAcademicYearEnd;
      }).length;
      const cy = `${currentAcademicYearStart.getFullYear()}-${currentAcademicYearStart.getFullYear() + 1}`;
      const py = `${prevAcademicYearStart.getFullYear()}-${prevAcademicYearStart.getFullYear() + 1}`;
      return { class: cls, [py]: prevYear, [cy]: currentYear };
    });

    // ─── Student Statistic (category/caste breakdown) ───
    const COLORS = ['#10b981', '#8b5cf6', '#fed7aa', '#fda4af', '#0ea5e9', '#eab308', '#7f1d1d', '#3b82f6', '#ef4444'];
    const casteMap = {};
    students.forEach(s => {
      const caste = s.personalDetails?.caste || s.personalDetails?.religion || 'Other';
      casteMap[caste] = (casteMap[caste] || 0) + 1;
    });
    const studentStatistic = Object.entries(casteMap).map(([name, value], i) => ({
      name, value, color: COLORS[i % COLORS.length]
    }));

    // ─── Online vs Offline Admission ───
    // No admissionMode field, so compute from existing data: those with dateOfAdmission = inSchool
    const onlineAdmission = 0;
    const offlineAdmission = students.filter(s => s.academicDetails?.dateOfAdmission).length;

    // ─── Fee Defaulter (class-wise) ───
    let feeDefaulters = [];
    let feeDefaulterSummary = { totalStudents: totalStudents, defaulterStudents: 0, defaultAmount: 0 };
    try {
      const fees = await Fee.find({ status: { $ne: 'Paid' } }).select('studentId amount class');
      const defaulterMap = {};
      fees.forEach(f => {
        const cls = f.class || 'Unknown';
        if (!defaulterMap[cls]) defaulterMap[cls] = { class: cls, total: 0, defaulter: 0, amount: 0 };
        defaulterMap[cls].defaulter += 1;
        defaulterMap[cls].amount += (f.amount || 0);
      });
      // Fill total students per class
      classNames.forEach(cls => {
        if (!defaulterMap[cls]) defaulterMap[cls] = { class: cls, total: 0, defaulter: 0, amount: 0 };
        defaulterMap[cls].total = students.filter(s => s.academicDetails?.class === cls).length;
      });
      feeDefaulters = Object.values(defaulterMap).sort((a, b) => a.class.localeCompare(b.class));
      feeDefaulterSummary.defaulterStudents = feeDefaulters.reduce((s, d) => s + d.defaulter, 0);
      feeDefaulterSummary.defaultAmount = feeDefaulters.reduce((s, d) => s + d.amount, 0);
    } catch (e) { /* Fee model may not have matching fields */ }

    // ─── Daily Collection (stub - Fee model structure unknown) ───
    const dailyCollection = {
      total: 0,
      modes: [
        { name: 'Cash', value: 0 }, { name: 'Cheque', value: 0 },
        { name: 'DD', value: 0 }, { name: 'NEFT', value: 0 },
        { name: 'Online', value: 0 }, { name: 'Swiped Card', value: 0 },
        { name: 'UPI', value: 0 }
      ]
    };

    // ─── Estimated Collection (stub) ───
    const estimatedCollection = { thisYear: [], tillToday: [] };

    // ─── Feed (latest notices) ───
    let feedItems = [];
    try {
      const latestNotices = await Notice.find({}).sort({ createdAt: -1 }).limit(5).select('title type createdAt');
      feedItems = latestNotices.map(n => ({
        type: n.type || 'Notice',
        title: n.title || '',
        date: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
      }));
    } catch (e) {}

    // ─── Activity Calendar (holidays from activities) ───
    let activityDates = [];
    try {
      const activities = await Activity.find({}).select('date title type');
      activityDates = activities.map(a => ({
        date: a.date,
        title: a.title || '',
        type: a.type || 'event'
      }));
    } catch (e) {}

    // ─── Questionnaire list ───
    let questionnaireList = [];
    try {
      const qs = await Questionnaire.find({}).sort({ createdAt: -1 }).limit(5).select('title createdAt');
      questionnaireList = qs.map(q => ({ title: q.title, date: q.createdAt }));
    } catch (e) {}

    // ─── Birthday Cards ───
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    const isToday = (dob) => {
      if (!dob) return false;
      const d = new Date(dob);
      return d.getMonth() + 1 === todayMonth && d.getDate() === todayDate;
    };

    const isUpcoming = (dob, days = 7) => {
      if (!dob) return false;
      const d = new Date(dob);
      const thisYear = new Date(today.getFullYear(), d.getMonth(), d.getDate());
      if (thisYear < today) thisYear.setFullYear(thisYear.getFullYear() + 1);
      const diff = (thisYear - today) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= days;
    };

    const colleagueBirthdays = staff.filter(s => isToday(s.dob)).length;
    const upcomingColleagueBirthdays = staff.filter(s => isUpcoming(s.dob)).length;
    const studentBirthdays = students.filter(s => isToday(s.personalDetails?.dateOfBirth)).length;
    const upcomingStudentBirthdays = students.filter(s => isUpcoming(s.personalDetails?.dateOfBirth)).length;

    res.status(200).json({
      // Cards
      totalStudents, boysCount, girlsCount,
      totalStaff, maleStaff, femaleStaff,
      newAdmissions,
      studentsPendingLeave: studentLeaves,
      staffPendingLeave: staffLeaves,
      newMessages: messages, newNotices: notices, newCirculars: circulars,
      questionnaires, thoughts,
      myAttendancePercent,
      newStaff: 0, studentsInInfirmary: 0, workload: 0,
      usersPhotoRequest: 0, iCardPhotoRequest: 0,
      staffProfileRequest: 0, approvalRequest: 0, studentProfileRequest: 0,

      // Widgets
      admissionStats,
      standardStats: { studying: studyingCount, left: leftCount, total: totalStudents + leftCount || totalStudents },
      admissionTypeStats: { online: onlineAdmission, offline: offlineAdmission },
      studentStatistic,
      feeDefaulters, feeDefaulterSummary,
      dailyCollection,
      estimatedCollection,
      feedItems,
      activityDates,
      questionnaireList,
      birthdayCards: {
        colleagueBirthdays,
        upcomingColleagueBirthdays,
        studentBirthdays,
        upcomingStudentBirthdays
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats
};

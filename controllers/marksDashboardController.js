const MarksDashboardConfig = require('../models/marksDashboardModel');

// Default initial dataset
const defaultStats = {
  academicYear: "2026-2027",
  marksEntryStatus: {
    locked: 45,
    inProgress: 35,
    pending: 20
  },
  modifiedEntries: {
    teachersCount: 14,
    entriesModifiedPercent: 6.8
  },
  passFailRatio: {
    passPercent: 95.6,
    failPercent: 4.4
  },
  performanceData: [
    { standard: "NUR", prevYear: 82, currYear: 88, highest: 98 },
    { standard: "LKG", prevYear: 85, currYear: 89, highest: 99 },
    { standard: "UKG", prevYear: 80, currYear: 86, highest: 97 },
    { standard: "I", prevYear: 78, currYear: 84, highest: 98.5 },
    { standard: "II", prevYear: 81, currYear: 85, highest: 99.2 },
    { standard: "III", prevYear: 76, currYear: 82, highest: 96.8 },
    { standard: "IV", prevYear: 79, currYear: 83, highest: 97.4 },
    { standard: "V", prevYear: 83, currYear: 87, highest: 98.9 },
    { standard: "VI", prevYear: 75, currYear: 81, highest: 96.0 },
    { standard: "VII", prevYear: 77, currYear: 84, highest: 97.2 },
    { standard: "VIII", prevYear: 74, currYear: 80, highest: 95.8 },
    { standard: "IX", prevYear: 72, currYear: 79, highest: 96.4 },
    { standard: "X", prevYear: 86, currYear: 91, highest: 99.4 },
    { standard: "XI", prevYear: 70, currYear: 78, highest: 95.2 },
    { standard: "XII", prevYear: 84, currYear: 90, highest: 98.8 },
  ],
  overallTopper: {
    name: "Aarav Sharma",
    standard: "Class X-A",
    rollNo: "101",
    percentage: "99.4%",
    marks: "497 / 500",
    schoolName: "Navals National Academy"
  },
  topStudentsList: [
    { rank: 1, name: "Aarav Sharma", standard: "Class X-A", percentage: "99.4%", marks: "497/500", avatarColor: "bg-amber-500" },
    { rank: 2, name: "Priya Patel", standard: "Class XII-Sci", percentage: "98.8%", marks: "494/500", avatarColor: "bg-blue-500" },
    { rank: 3, name: "Rohan Verma", standard: "Class IX-B", percentage: "98.5%", marks: "492/500", avatarColor: "bg-emerald-500" },
    { rank: 4, name: "Ananya Gupta", standard: "Class VIII-A", percentage: "97.8%", marks: "489/500", avatarColor: "bg-purple-500" },
    { rank: 5, name: "Aditya Singh", standard: "Class VII-C", percentage: "97.2%", marks: "486/500", avatarColor: "bg-rose-500" },
  ],
  subjectComparisonData: [
    { subject: "English", passRate: 98, avgMarks: 82 },
    { subject: "Hindi", passRate: 99, avgMarks: 86 },
    { subject: "Mathematics", passRate: 94, avgMarks: 79 },
    { subject: "Science", passRate: 95, avgMarks: 81 },
    { subject: "Social Science", passRate: 97, avgMarks: 84 },
    { subject: "Computer", passRate: 100, avgMarks: 91 },
    { subject: "Sanskrit", passRate: 99, avgMarks: 88 },
  ]
};

// @desc Get Marks Manager Dashboard Stats
// @route GET /api/marks-manager/dashboard-stats
exports.getMarksDashboardStats = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const query = academicYear ? { academicYear } : {};
    let config = await MarksDashboardConfig.findOne(query).sort({ createdAt: -1 });

    if (!config) {
      // Seed default if empty
      config = await MarksDashboardConfig.create({
        ...defaultStats,
        academicYear: academicYear || "2026-2027"
      });
    }

    res.status(200).json({
      success: true,
      data: config
    });
  } catch (err) {
    console.error('Error in getMarksDashboardStats:', err);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving Marks Manager stats',
      error: err.message
    });
  }
};

// @desc Update Marks Manager Dashboard Stats
// @route POST /api/marks-manager/dashboard-stats
exports.updateMarksDashboardStats = async (req, res) => {
  try {
    const payload = req.body;
    const year = payload.academicYear || "2026-2027";

    const updated = await MarksDashboardConfig.findOneAndUpdate(
      { academicYear: year },
      { $set: payload },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Marks Dashboard updated successfully'
    });
  } catch (err) {
    console.error('Error updating MarksDashboardStats:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update stats',
      error: err.message
    });
  }
};

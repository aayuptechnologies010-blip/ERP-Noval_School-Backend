const Timetable = require('../models/timetableModel');
const Staff = require('../models/staffModel');
const StaffAttendance = require('../models/staffAttendanceModel');

// @desc    Upsert (Create or Update) Timetable for a Class and Section
// @route   POST /api/timetables
// @access  Private (Admin)
const upsertTimetable = async (req, res) => {
  try {
    const { class: className, section, schedule } = req.body;

    if (!className || !section || !schedule) {
      return res.status(400).json({ message: 'class, section, and schedule are required.' });
    }

    const adminId = req.user?._id;

    let timetable = await Timetable.findOne({ class: className, section });

    if (timetable) {
      timetable.schedule = schedule;
      timetable.updatedBy = adminId;
      await timetable.save();
      return res.json({ message: 'Timetable updated successfully', timetable });
    } else {
      timetable = new Timetable({
        class: className,
        section,
        schedule,
        createdBy: adminId,
        updatedBy: adminId
      });
      await timetable.save();
      return res.status(201).json({ message: 'Timetable created successfully', timetable });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Timetable for a Class and Section
// @route   GET /api/timetables?class=Class 10&section=A
// @access  Private (Admin)
const getTimetable = async (req, res) => {
  try {
    const { class: className, section } = req.query;

    if (!className || !section) {
      return res.status(400).json({ message: 'class and section query params are required.' });
    }

    const timetable = await Timetable.findOne({ class: className, section })
      .populate('schedule.periods.teacher', 'title firstName lastName');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found for this class and section.' });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Timetable for a Class and Section
// @route   DELETE /api/timetables?class=Class 10&section=A
// @access  Private (Admin)
const deleteTimetable = async (req, res) => {
  try {
    const { class: className, section } = req.query;

    if (!className || !section) {
      return res.status(400).json({ message: 'class and section query params are required.' });
    }

    const timetable = await Timetable.findOneAndDelete({ class: className, section });

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found for this class and section.' });
    }

    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Timetable Dashboard Stats
// @route   GET /api/timetables/dashboard-stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalTeachers = await Staff.countDocuments();
    
    // Simulate class teachers (approx 40% of total staff)
    const classTeachers = Math.floor(totalTeachers * 0.4);

    // Get today's start and end date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendances = await StaffAttendance.find({
      date: { $gte: today, $lt: tomorrow }
    });
    
    const presentToday = attendances.filter(a => a.status === 'Present').length;
    const absentToday = attendances.filter(a => a.status === 'Absent').length;

    // Simulate subject stats based on timetable
    const timetables = await Timetable.find();
    let uniqueSubjects = new Set();
    timetables.forEach(t => {
      t.schedule.forEach(day => {
        day.periods.forEach(p => {
          if (p.subject && !p.isBreak) uniqueSubjects.add(p.subject);
        });
      });
    });

    const majorSubjects = uniqueSubjects.size;
    const minorSubjects = Math.floor(majorSubjects * 0.1) || 3;

    res.json({
      totalTeachers,
      classTeachers,
      presentToday,
      absentToday,
      majorSubjects,
      minorSubjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upsertTimetable,
  getTimetable,
  deleteTimetable,
  getDashboardStats
};

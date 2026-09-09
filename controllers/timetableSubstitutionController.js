const MarkAttendance = require('../models/timetableMarkAttendanceModel');
const Substitution = require('../models/timetableSubstitutionModel');
const Staff = require('../models/staffModel');

// ============================================================
// MARK ATTENDANCE
// ============================================================

// @desc  Get attendance for a specific date
// @route GET /api/timetables/mark-attendance?date=YYYY-MM-DD
const getMarkAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date query param is required.' });

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const record = await MarkAttendance.findOne({ date: { $gte: dateObj, $lt: nextDay } })
      .populate('attendances.teacherId', 'name firstName lastName employeeId');

    if (!record) {
      // Return all staff with default 'Present' status if no record found
      const staff = await Staff.find({}, 'name firstName lastName employeeId');
      return res.json({
        date: dateObj,
        day: req.query.day || '',
        attendances: staff.map(s => ({
          teacherId: { _id: s._id, name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() },
          attendanceType: 'Present'
        }))
      });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Save / update attendance for a date
// @route POST /api/timetables/mark-attendance
const saveMarkAttendance = async (req, res) => {
  try {
    const { date, day, attendances } = req.body;
    if (!date || !attendances) return res.status(400).json({ message: 'date and attendances are required.' });

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    let record = await MarkAttendance.findOne({ date: dateObj });
    if (record) {
      record.day = day || record.day;
      record.attendances = attendances;
      record.markedBy = req.user?._id;
      await record.save();
    } else {
      record = await MarkAttendance.create({
        date: dateObj,
        day: day || '',
        attendances,
        markedBy: req.user?._id
      });
    }

    res.json({ message: 'Attendance saved successfully', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// SUBSTITUTION
// ============================================================

// @desc  Get substitutions for a specific date
// @route GET /api/timetables/substitution?date=YYYY-MM-DD
const getSubstitutions = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'date query param is required.' });

    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await Substitution.find({ date: { $gte: dateObj, $lt: nextDay } })
      .populate('absentTeacherId', 'name firstName lastName')
      .populate('substituteTeacherId', 'name firstName lastName');

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create a new substitution entry
// @route POST /api/timetables/substitution
const createSubstitution = async (req, res) => {
  try {
    const { date, day, absentTeacherId, period, classSubject, substituteTeacherId, wing, remarks } = req.body;
    if (!date || !absentTeacherId || !period) {
      return res.status(400).json({ message: 'date, absentTeacherId, and period are required.' });
    }

    const record = await Substitution.create({
      date: new Date(date),
      day: day || '',
      absentTeacherId,
      period,
      classSubject: classSubject || '',
      substituteTeacherId: substituteTeacherId || null,
      wing: wing || '',
      remarks: remarks || '',
      createdBy: req.user?._id
    });

    const populated = await Substitution.findById(record._id)
      .populate('absentTeacherId', 'name firstName lastName')
      .populate('substituteTeacherId', 'name firstName lastName');

    res.status(201).json({ message: 'Substitution created successfully', record: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update a substitution entry
// @route PUT /api/timetables/substitution/:id
const updateSubstitution = async (req, res) => {
  try {
    const record = await Substitution.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('absentTeacherId', 'name firstName lastName')
      .populate('substituteTeacherId', 'name firstName lastName');
    if (!record) return res.status(404).json({ message: 'Substitution not found.' });
    res.json({ message: 'Substitution updated successfully', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a substitution entry
// @route DELETE /api/timetables/substitution/:id
const deleteSubstitution = async (req, res) => {
  try {
    const record = await Substitution.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Substitution not found.' });
    res.json({ message: 'Substitution deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMarkAttendance,
  saveMarkAttendance,
  getSubstitutions,
  createSubstitution,
  updateSubstitution,
  deleteSubstitution
};

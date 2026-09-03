const TransportAttendance = require('../models/transportAttendanceModel');
const TransportOutPass = require('../models/transportOutPassModel');
const Student = require('../models/studentModel');

// @desc    Mark Transport Attendance
// @route   POST /api/transport/attendance
// @access  Private (Admin/Staff)
const markAttendance = async (req, res) => {
  try {
    const { date, route, tripType, stop, records } = req.body;

    // Check if record exists for this date, route, trip
    let attendance = await TransportAttendance.findOne({ date, route, tripType, stop });

    if (attendance) {
      // Update existing records
      attendance.records = records;
      attendance.createdBy = req.user?._id;
    } else {
      // Create new
      attendance = new TransportAttendance({
        date,
        route,
        tripType,
        stop,
        records,
        createdBy: req.user?._id
      });
    }

    const saved = await attendance.save();
    res.status(200).json({ message: 'Attendance saved successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Transport Attendance
// @route   GET /api/transport/attendance
// @access  Private (Admin/Staff)
const getAttendance = async (req, res) => {
  try {
    const { date, tripType } = req.query;
    let query = {};
    if (date) query.date = date;
    if (tripType && tripType !== 'All') query.tripType = tripType;

    const attendances = await TransportAttendance.find(query).populate('records.studentId', 'personalDetails.firstName personalDetails.lastName academicDetails.class academicDetails.section academicDetails.admissionNo personalDetails.fatherDetails.fatherName personalDetails.fatherDetails.mobileNo');
    
    // Format for frontend
    const formatted = [];
    attendances.forEach(att => {
      att.records.forEach(r => {
        if (r.studentId) {
          formatted.push({
            id: r.studentId._id,
            adm: r.studentId.academicDetails?.admissionNo || '-',
            name: `${r.studentId.personalDetails?.firstName || ''} ${r.studentId.personalDetails?.lastName || ''}`.trim(),
            father: r.studentId.personalDetails?.fatherDetails?.fatherName || '-',
            cls: `${r.studentId.academicDetails?.class || ''} ${r.studentId.academicDetails?.section || ''}`.trim(),
            contact: r.studentId.personalDetails?.fatherDetails?.mobileNo || '-',
            date: att.date.toISOString().split('T')[0],
            tripType: att.tripType,
            route: att.route,
            stop: att.stop,
            morningStatus: r.morningStatus,
            afternoonStatus: r.afternoonStatus
          });
        }
      });
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Students for Attendance (Mock filter if no transport data on student)
// @route   GET /api/transport/students
// @access  Private (Admin/Staff)
const getTransportStudents = async (req, res) => {
  try {
    // For now, fetch all students because they don't have route assignments yet
    const students = await Student.find({}).select('personalDetails.firstName personalDetails.lastName academicDetails.class academicDetails.section academicDetails.admissionNo personalDetails.fatherDetails.fatherName personalDetails.fatherDetails.mobileNo');
    
    const formatted = students.map((s, index) => ({
      id: s._id,
      adm: s.academicDetails?.admissionNo || `00${index+1}`,
      name: `${s.personalDetails?.firstName || ''} ${s.personalDetails?.lastName || ''}`.trim(),
      father: s.personalDetails?.fatherDetails?.fatherName || '-',
      cls: `${s.academicDetails?.class || ''} ${s.academicDetails?.section || ''}`.trim(),
      contact: s.personalDetails?.fatherDetails?.mobileNo || '-'
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Out Pass
// @route   POST /api/transport/outpass
// @access  Private (Admin/Staff)
const createOutPass = async (req, res) => {
  try {
    const { studentId, className, section, assignDate, endDate } = req.body;
    
    const outpass = new TransportOutPass({
      studentId,
      className,
      section,
      assignDate,
      endDate,
      createdBy: req.user?._id
    });

    const saved = await outpass.save();
    res.status(201).json({ message: 'Out pass created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Out Passes
// @route   GET /api/transport/outpass
// @access  Private (Admin/Staff)
const getOutPasses = async (req, res) => {
  try {
    const passes = await TransportOutPass.find({}).populate('studentId', 'personalDetails.firstName personalDetails.lastName academicDetails.admissionNo personalDetails.fatherDetails.mobileNo');
    
    const formatted = passes.map(p => ({
      id: p._id,
      adm: p.studentId?.academicDetails?.admissionNo || '-',
      name: `${p.studentId?.personalDetails?.firstName || ''} ${p.studentId?.personalDetails?.lastName || ''}`.trim(),
      contact: p.studentId?.personalDetails?.fatherDetails?.mobileNo || '-',
      cls: p.className,
      section: p.section,
      assignDate: p.assignDate.toISOString().split('T')[0],
      endDate: p.endDate.toISOString().split('T')[0]
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getTransportStudents,
  createOutPass,
  getOutPasses
};

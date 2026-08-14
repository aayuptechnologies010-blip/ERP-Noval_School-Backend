const TeacherObservation = require('../models/teacherObservationModel');
const Staff = require('../models/staffModel');

// @desc    Create a new teacher observation
// @route   POST /api/teacher-observations
// @access  Private (Admin)
const createObservation = async (req, res) => {
  try {
    const { staff, observationDate, subject, topic, remarks, rating } = req.body;

    const observation = new TeacherObservation({
      staff,
      observationDate,
      subject,
      topic,
      remarks,
      rating,
      observedBy: req.user?._id
    });

    const saved = await observation.save();
    res.status(201).json({ message: 'Observation recorded successfully', data: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teacher observations
// @route   GET /api/teacher-observations
// @access  Private (Admin)
const getAllObservations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.staff) {
      filter.staff = req.query.staff;
    }
    const observations = await TeacherObservation.find(filter)
      .populate('staff', 'firstName lastName designation mobile email')
      .populate('observedBy', 'name email')
      .sort({ observationDate: -1 });
      
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get observations for a specific staff
// @route   GET /api/teacher-observations/staff/:staffId
// @access  Private (Admin)
const getObservationsByStaff = async (req, res) => {
  try {
    const observations = await TeacherObservation.find({ staff: req.params.staffId })
      .populate('observedBy', 'name email')
      .sort({ observationDate: -1 });
    res.json(observations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get observation by ID
// @route   GET /api/teacher-observations/:id
// @access  Private (Admin)
const getObservationById = async (req, res) => {
  try {
    const observation = await TeacherObservation.findById(req.params.id)
      .populate('staff', 'firstName lastName designation')
      .populate('observedBy', 'name');
      
    if (!observation) return res.status(404).json({ message: 'Observation not found' });
    res.json(observation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update observation
// @route   PUT /api/teacher-observations/:id
// @access  Private (Admin)
const updateObservation = async (req, res) => {
  try {
    const observation = await TeacherObservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!observation) return res.status(404).json({ message: 'Observation not found' });
    res.json({ message: 'Observation updated successfully', data: observation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete observation
// @route   DELETE /api/teacher-observations/:id
// @access  Private (Admin)
const deleteObservation = async (req, res) => {
  try {
    const observation = await TeacherObservation.findByIdAndDelete(req.params.id);
    if (!observation) return res.status(404).json({ message: 'Observation not found' });
    res.json({ message: 'Observation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get teacher observation report
// @route   GET /api/teacher-observations/report
// @access  Private (Admin)
const getObservationReport = async (req, res) => {
  try {
    const { staff, fromDate, toDate } = req.query;
    
    const filter = {};
    
    if (staff) {
      filter.staff = staff;
    }
    
    if (fromDate || toDate) {
      filter.observationDate = {};
      if (fromDate) {
        // Set to start of the day
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        filter.observationDate.$gte = start;
      }
      if (toDate) {
        // Set to end of the day
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        filter.observationDate.$lte = end;
      }
    }

    const observations = await TeacherObservation.find(filter)
      .populate('staff', 'firstName lastName')
      .sort({ observationDate: -1 });

    // Format response to match the UI requirements
    const reportData = observations.map(obs => {
      const staffName = obs.staff 
        ? `${obs.staff.firstName || ''} ${obs.staff.lastName || ''}`.trim()
        : 'Unknown';
        
      return {
        id: obs._id,
        teacherName: staffName,
        date: obs.observationDate,
        subject: obs.subject || '',
        topic: obs.topic || '',
        score: obs.rating,
        remarks: obs.remarks
      };
    });

    res.json({
      success: true,
      count: reportData.length,
      data: reportData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createObservation,
  getAllObservations,
  getObservationsByStaff,
  getObservationById,
  updateObservation,
  deleteObservation,
  getObservationReport
};

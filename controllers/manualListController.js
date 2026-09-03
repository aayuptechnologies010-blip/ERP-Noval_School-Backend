const ProspectusEntry = require('../models/prospectusEntryModel');

// @desc    Get students for manual list generation
// @route   GET /api/manual-list-generation
// @access  Private
const getStudentsForList = async (req, res) => {
  try {
    const { studentClass, meritList, admDateFrom, admDateTo, session } = req.query;
    const filter = {};

    if (studentClass) filter.studentClass = studentClass;
    if (session) filter.session = session;
    if (meritList) filter.meritList = meritList;
    
    if (admDateFrom || admDateTo) {
      filter.date = {};
      if (admDateFrom) {
        filter.date.$gte = new Date(admDateFrom);
      }
      if (admDateTo) {
        let endDate = new Date(admDateTo);
        endDate.setUTCHours(23, 59, 59, 999);
        filter.date.$lte = endDate;
      }
    }

    const students = await ProspectusEntry.find(filter)
      .select('prospectusNo studentName fatherName contactMobile remark studentClass selectedClass admStatus meritList');

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update manual list generation status
// @route   PUT /api/manual-list-generation
// @access  Private
const updateManualList = async (req, res) => {
  try {
    const { selectDate, students, meritList } = req.body; 
    
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: 'Invalid students data' });
    }

    const updatePromises = students.map(student => {
      // Create update object dynamically based on provided fields
      const updateData = {};
      if (student.selectedClass !== undefined) updateData.selectedClass = student.selectedClass;
      if (student.admStatus !== undefined) updateData.admStatus = student.admStatus;
      if (student.remark !== undefined) updateData.remark = student.remark;
      if (selectDate !== undefined) updateData.meritListDate = selectDate;
      if (meritList !== undefined) updateData.meritList = meritList;
      
      return ProspectusEntry.findByIdAndUpdate(
        student.id,
        { $set: updateData },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.json({ message: 'Manual list generated/updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentsForList,
  updateManualList
};

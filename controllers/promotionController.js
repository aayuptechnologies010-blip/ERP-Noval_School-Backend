const Student = require('../models/studentModel');
const PromotionHistory = require('../models/promotionHistoryModel');

// Student fields to return in listings
const STUDENT_SELECT =
  'personalDetails.firstName personalDetails.lastName personalDetails.studentPhoto academicDetails.admissionNumber academicDetails.class academicDetails.section academicDetails.rollNumber academicDetails.currentStatus';

// ─── Controllers ───────────────────────────────────────────────────────────

/**
 * @desc    Fetch students eligible for promotion from a given class/section
 *          Only returns STUDYING students
 * @route   GET /api/promotions/eligible?class=UKG&section=A&session=2025-2026
 * @access  Private (Admin)
 */
const getEligibleStudents = async (req, res) => {
  try {
    const { class: className, section } = req.query;

    if (!className) {
      return res.status(400).json({ message: 'class query param is required.' });
    }

    // Build filter — only STUDYING students
    const filter = {
      'academicDetails.class': className,
      'academicDetails.currentStatus': 'STUDYING',
    };

    if (section) {
      filter['academicDetails.section'] = section;
    }

    const students = await Student.find(filter)
      .select(STUDENT_SELECT)
      .sort({ 'academicDetails.rollNumber': 1 });

    res.json({
      class: className,
      section: section || 'All',
      total: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Promote selected students to a new class / section / session
 *          - Updates each student's academicDetails (class, section, previousClass)
 *          - Creates a PromotionHistory record for each student (audit trail)
 *          - Supports partial promotion (only selected student IDs)
 *
 * @route   POST /api/promotions/promote
 * @access  Private (Admin)
 *
 * Body: {
 *   fromSession: "2025-2026",
 *   fromClass:   "UKG",
 *   fromSection: "A",
 *   toSession:   "2026-2027",
 *   toClass:     "1",
 *   toSection:   "A",
 *   studentIds:  ["id1", "id2", ...],
 *   remarks:     "Annual Promotion 2026"   // optional
 * }
 */
const promoteStudents = async (req, res) => {
  try {
    const {
      fromSession,
      fromClass,
      fromSection,
      toSession,
      toClass,
      toSection,
      studentIds,
      remarks,
    } = req.body;

    // Validation
    if (!fromClass || !toClass || !toSession || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        message: 'fromClass, toClass, toSession, and studentIds[] are required.',
      });
    }

    const promotedBy = req.user?._id || null;
    const promotedAt = new Date();

    const results = { success: [], failed: [] };
    const historyDocs = [];

    // Process each student
    for (const sid of studentIds) {
      try {
        const student = await Student.findById(sid);

        if (!student) {
          results.failed.push({ studentId: sid, reason: 'Student not found' });
          continue;
        }

        const oldRollNo = student.academicDetails?.rollNumber || '';
        const oldClass  = student.academicDetails?.class || fromClass;
        const oldSection = student.academicDetails?.section || fromSection || '';

        // Update student's academic details
        student.academicDetails.previousClass = `${oldClass} ${oldSection}`.trim();
        student.academicDetails.class         = toClass;
        student.academicDetails.section       = toSection || '';
        // Reset roll number — admin can re-assign later (keep old one for now)
        // If you want to clear it: student.academicDetails.rollNumber = '';

        await student.save();

        // Build history record
        historyDocs.push({
          studentId:   sid,
          fromSession: fromSession || '',
          fromClass:   oldClass,
          fromSection: oldSection,
          fromRollNo:  oldRollNo,
          toSession,
          toClass,
          toSection:   toSection || '',
          toRollNo:    oldRollNo, // carry forward; admin updates manually if needed
          promotedBy,
          promotedAt,
          remarks:     remarks || '',
        });

        results.success.push({
          studentId: sid,
          name: `${student.personalDetails?.firstName || ''} ${student.personalDetails?.lastName || ''}`.trim(),
          admissionNumber: student.academicDetails?.admissionNumber || '',
          promotedTo: `${toClass} ${toSection || ''}`.trim(),
        });
      } catch (err) {
        results.failed.push({ studentId: sid, reason: err.message });
      }
    }

    // Bulk insert promotion history records
    if (historyDocs.length > 0) {
      await PromotionHistory.insertMany(historyDocs);
    }

    res.json({
      message: `Promotion completed. ${results.success.length} promoted, ${results.failed.length} failed.`,
      from: { session: fromSession || 'N/A', class: fromClass, section: fromSection || 'All' },
      to:   { session: toSession, class: toClass, section: toSection || '' },
      totalRequested: studentIds.length,
      totalPromoted:  results.success.length,
      totalFailed:    results.failed.length,
      success: results.success,
      failed:  results.failed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get promotion history log
 *          Filter by class, session, student name, or date range
 * @route   GET /api/promotions/history?toClass=1&toSession=2026-2027&page=1&limit=20
 * @access  Private (Admin)
 */
const getPromotionHistory = async (req, res) => {
  try {
    const {
      fromClass,
      toClass,
      fromSession,
      toSession,
      page  = 1,
      limit = 50,
    } = req.query;

    const filter = {};

    if (fromClass)   filter.fromClass   = fromClass;
    if (toClass)     filter.toClass     = toClass;
    if (fromSession) filter.fromSession = fromSession;
    if (toSession)   filter.toSession   = toSession;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [records, total] = await Promise.all([
      PromotionHistory.find(filter)
        .populate({
          path: 'studentId',
          select: STUDENT_SELECT,
        })
        .populate('promotedBy', 'firstName lastName username')
        .sort({ promotedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PromotionHistory.countDocuments(filter),
    ]);

    res.json({
      total,
      page:  parseInt(page),
      limit: parseInt(limit),
      records,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get promotion history for a specific student
 * @route   GET /api/promotions/history/student/:studentId
 * @access  Private (Admin)
 */
const getStudentPromotionHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId).select(STUDENT_SELECT);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const history = await PromotionHistory.find({ studentId })
      .populate('promotedBy', 'firstName lastName')
      .sort({ promotedAt: -1 });

    res.json({
      student,
      totalPromotions: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get distinct classes and sections from current students
 *          Useful for populating the "From Class" dropdown in UI
 * @route   GET /api/promotions/classes
 * @access  Private (Admin)
 */
const getDistinctClasses = async (req, res) => {
  try {
    // Get distinct classes
    const classes = await Student.distinct('academicDetails.class', {
      'academicDetails.currentStatus': 'STUDYING',
    });

    // Get class → sections mapping
    const classData = await Student.aggregate([
      { $match: { 'academicDetails.currentStatus': 'STUDYING' } },
      {
        $group: {
          _id: {
            class:   '$academicDetails.class',
            section: '$academicDetails.section',
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.class': 1, '_id.section': 1 } },
    ]);

    // Group sections under each class
    const classMap = {};
    classData.forEach((item) => {
      const cls = item._id.class || '';
      const sec = item._id.section || '';
      if (!classMap[cls]) classMap[cls] = [];
      classMap[cls].push({ section: sec, count: item.count });
    });

    const result = Object.entries(classMap).map(([cls, sections]) => ({
      class:    cls,
      sections,
      total:    sections.reduce((sum, s) => sum + s.count, 0),
    }));

    res.json({
      totalClasses: result.length,
      classes: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete a promotion history record (undo/correction)
 *          Note: This does NOT revert the student's class — admin must do that manually via student update API
 * @route   DELETE /api/promotions/history/:id
 * @access  Private (Admin)
 */
const deletePromotionRecord = async (req, res) => {
  try {
    const record = await PromotionHistory.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Promotion history record not found.' });
    }

    res.json({
      message: 'Promotion history record deleted. Note: Student class was NOT reverted automatically.',
      record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ───────────────────────────────────────────────────────────────────────────

module.exports = {
  getEligibleStudents,
  promoteStudents,
  getPromotionHistory,
  getStudentPromotionHistory,
  getDistinctClasses,
  deletePromotionRecord,
};

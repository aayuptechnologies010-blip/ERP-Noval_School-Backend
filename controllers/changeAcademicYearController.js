const AcademicYear = require('../models/academicYearModel');
const FinancialYear = require('../models/financialYearModel');
const SchoolGlobalDetails = require('../models/schoolGlobalDetailsModel');

// @desc    Get options for Change Academic Year dropdowns
// @route   GET /api/change-academic-year/options
// @access  Private
const getChangeAcademicYearOptions = async (req, res) => {
  try {
    const academicYears = await AcademicYear.find({}).sort({ startDate: -1 });
    const financialYears = await FinancialYear.find({}).sort({ startDate: -1 });
    const schools = await SchoolGlobalDetails.find({}).sort({ schoolName: 1 });

    res.status(200).json({
      academicYears,
      financialYears,
      schools
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change current academic year globally
// @route   POST /api/change-academic-year
// @access  Private
const changeAcademicYear = async (req, res) => {
  try {
    const { academicYearId, financialYearId, schoolId } = req.body;

    if (!academicYearId || !financialYearId || !schoolId) {
      return res.status(400).json({ message: 'Academic Year, Financial Year, and School are required' });
    }

    // Update Academic Year (Set all to false, then selected to true)
    await AcademicYear.updateMany({}, { isActive: false });
    await AcademicYear.findByIdAndUpdate(academicYearId, { isActive: true });

    // Update Financial Year (Set all to false, then selected to true)
    await FinancialYear.updateMany({}, { isActive: false });
    await FinancialYear.findByIdAndUpdate(financialYearId, { isActive: true });

    // Update School (Assuming the selected school becomes the main/active context)
    // If schoolGlobalDetailsSchema has `isMainSchool`, we can update it
    await SchoolGlobalDetails.updateMany({}, { isMainSchool: false });
    await SchoolGlobalDetails.findByIdAndUpdate(schoolId, { isMainSchool: true });

    res.status(200).json({
      message: 'Academic Year, Financial Year, and School changed successfully globally.'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChangeAcademicYearOptions,
  changeAcademicYear
};

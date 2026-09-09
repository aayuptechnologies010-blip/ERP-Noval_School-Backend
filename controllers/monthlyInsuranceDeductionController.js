const MonthlyInsuranceDeduction = require('../models/monthlyInsuranceDeductionModel');
const EmployeeInsurancePolicy = require('../models/employeeInsurancePolicyModel');

// @desc    Get monthly insurance deductions by monthYear
// @route   GET /api/monthly-insurance-deductions
// @access  Private
const getMonthlyDeductions = async (req, res) => {
  try {
    const { monthYear } = req.query;
    const filter = {};
    if (monthYear) filter.monthYear = monthYear;

    const deductions = await MonthlyInsuranceDeduction.find(filter).sort({ staffName: 1 });
    res.json(deductions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate monthly insurance deductions from active policies
// @route   POST /api/monthly-insurance-deductions/generate
// @access  Private
const generateMonthlyDeductions = async (req, res) => {
  try {
    const { monthYear, month, year } = req.body;

    if (!monthYear) {
      return res.status(400).json({ message: 'monthYear is required' });
    }

    // Check all active employee policies
    const activePolicies = await EmployeeInsurancePolicy.find({ status: 'Active' });
    if (activePolicies.length === 0) {
      return res.status(404).json({ message: 'No active employee insurance policies found to generate deductions' });
    }

    // Delete existing deductions for this month to prevent duplication
    await MonthlyInsuranceDeduction.deleteMany({ monthYear });

    const deductionsToInsert = activePolicies.map(p => ({
      monthYear,
      month: month || monthYear.split('-')[0] || '',
      year: year || monthYear.split('-')[1] || '',
      staffId: p.staffId,
      staffName: p.staffName,
      empNo: p.empNo,
      policyId: p._id,
      policyNo: p.policyNo,
      policyName: p.policyName,
      vendorName: p.vendorName,
      premiumAmount: p.premiumAmount,
      status: 'Scheduled',
      remarks: `Generated for ${monthYear}`
    }));

    const result = await MonthlyInsuranceDeduction.insertMany(deductionsToInsert);

    res.status(201).json({
      message: `Generated ${result.length} insurance policy deduction(s) for ${monthYear}`,
      count: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/clear all monthly insurance deductions for a monthYear
// @route   DELETE /api/monthly-insurance-deductions
// @access  Private
const deleteMonthlyDeductions = async (req, res) => {
  try {
    const monthYear = req.query.monthYear || req.body.monthYear;
    if (!monthYear) {
      return res.status(400).json({ message: 'monthYear is required to delete monthly deductions' });
    }

    const result = await MonthlyInsuranceDeduction.deleteMany({ monthYear });
    res.json({ message: `Deleted ${result.deletedCount} deduction records for ${monthYear}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update single monthly insurance deduction
// @route   PUT /api/monthly-insurance-deductions/:id
// @access  Private
const updateSingleDeduction = async (req, res) => {
  try {
    const { premiumAmount, status, remarks } = req.body;
    const deduction = await MonthlyInsuranceDeduction.findById(req.params.id);
    if (!deduction) {
      return res.status(404).json({ message: 'Deduction record not found' });
    }

    if (premiumAmount !== undefined) deduction.premiumAmount = Number(premiumAmount) || 0;
    if (status) deduction.status = status;
    if (remarks !== undefined) deduction.remarks = remarks;

    const updated = await deduction.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete single monthly insurance deduction
// @route   DELETE /api/monthly-insurance-deductions/:id
// @access  Private
const deleteSingleDeduction = async (req, res) => {
  try {
    const deduction = await MonthlyInsuranceDeduction.findByIdAndDelete(req.params.id);
    if (!deduction) {
      return res.status(404).json({ message: 'Deduction record not found' });
    }
    res.json({ message: 'Deduction record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMonthlyDeductions,
  generateMonthlyDeductions,
  deleteMonthlyDeductions,
  updateSingleDeduction,
  deleteSingleDeduction
};

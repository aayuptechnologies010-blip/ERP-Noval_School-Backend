const Payslip = require('../models/payslipModel');
const Staff = require('../models/staffModel');

// @desc    Generate a new payslip
// @route   POST /api/payslips
// @access  Private
const generatePayslip = async (req, res) => {
  try {
    const { staffId, month, year, earnings, deductions } = req.body;

    if (!staffId || !month || !year) {
      return res.status(400).json({ message: 'staffId, month, and year are required.' });
    }

    const existing = await Payslip.findOne({ staffId, month, year });
    if (existing) {
      return res.status(400).json({ message: 'Payslip for this month and year already exists.' });
    }

    const grossEarnings = (earnings?.basicPay || 0) + (earnings?.houseRentAllowance || 0) + 
                          (earnings?.conveyanceAllowance || 0) + (earnings?.medicalAllowance || 0) + (earnings?.others || 0);
                          
    const totalDeductions = (deductions?.providentFund || 0) + (deductions?.professionalTax || 0) + 
                            (deductions?.incomeTax || 0) + (deductions?.others || 0);
                            
    const netPayableAmount = grossEarnings - totalDeductions;

    const payslip = new Payslip({
      staffId,
      month,
      year,
      earnings,
      deductions,
      grossEarnings,
      totalDeductions,
      netPayableAmount
    });

    const saved = await payslip.save();
    res.status(201).json({ message: 'Payslip generated successfully', payslip: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payslip by staff, month and year
// @route   GET /api/payslips/my-payslip?staffId=123&month=October&year=2023
// @access  Private
const getMyPayslip = async (req, res) => {
  try {
    const { staffId, month, year } = req.query;

    if (!staffId || !month || !year) {
      return res.status(400).json({ message: 'staffId, month, and year are required.' });
    }

    const payslip = await Payslip.findOne({ staffId, month, year })
      .populate('staffId', 'firstName lastName userName designation');

    if (!payslip) {
      return res.status(404).json({ message: 'Payslip not found for the selected month and year.' });
    }

    res.json({
      success: true,
      data: {
        id: payslip._id,
        month: payslip.month,
        year: payslip.year,
        employeeName: payslip.staffId ? `${payslip.staffId.firstName} ${payslip.staffId.lastName}` : 'Unknown',
        employeeId: payslip.staffId ? payslip.staffId.userName : 'N/A',
        designation: payslip.staffId ? payslip.staffId.designation : 'N/A',
        department: 'Science', // Currently not mapped in DB, using placeholder for UI compatibility
        earnings: {
          basicPay: payslip.earnings.basicPay,
          houseRentAllowance: payslip.earnings.houseRentAllowance,
          conveyanceAllowance: payslip.earnings.conveyanceAllowance,
          medicalAllowance: payslip.earnings.medicalAllowance,
          grossEarnings: payslip.grossEarnings
        },
        deductions: {
          providentFund: payslip.deductions.providentFund,
          professionalTax: payslip.deductions.professionalTax,
          incomeTax: payslip.deductions.incomeTax,
          totalDeductions: payslip.totalDeductions
        },
        netPayableAmount: payslip.netPayableAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generatePayslip,
  getMyPayslip
};

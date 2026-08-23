const Fee = require('../models/feeModel');
const Student = require('../models/studentModel');

// @desc    Generate a new fee for a student
// @route   POST /api/fees
// @access  Private (Admin/Accountant)
const generateFee = async (req, res) => {
  try {
    const { studentId, feeType, amount, dueDate, remarks } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const fee = await Fee.create({
      student: studentId,
      feeType,
      amount,
      dueDate,
      remarks
    });

    res.status(201).json({ message: 'Fee generated successfully', fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process fee payment
// @route   POST /api/fees/:id/pay
// @access  Private (Admin/Accountant)
const payFee = async (req, res) => {
  try {
    const { amountToPay, paymentMethod, remarks } = req.body;
    
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    if (fee.status === 'Paid') {
      return res.status(400).json({ message: 'This fee is already fully paid' });
    }

    const newAmountPaid = fee.amountPaid + Number(amountToPay);

    if (newAmountPaid > fee.amount) {
      return res.status(400).json({ message: 'Payment amount exceeds the total fee amount' });
    }

    fee.amountPaid = newAmountPaid;
    fee.paymentMethod = paymentMethod;
    fee.paymentDate = Date.now();

    if (fee.amountPaid === fee.amount) {
      fee.status = 'Paid';
    } else {
      fee.status = 'Partially Paid';
    }

    if (remarks) {
      fee.remarks = remarks;
    }

    const updatedFee = await fee.save();
    res.json({ message: 'Payment processed successfully', fee: updatedFee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fees for a specific student
// @route   GET /api/fees/student/:studentId
// @access  Private (Admin/Staff)
const getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId }).sort('-createdAt');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all fees (with optional filters)
// @route   GET /api/fees
// @access  Private (Admin/Accountant)
const getAllFees = async (req, res) => {
  try {
    const { status, feeType } = req.query;
    
    // Auto-update overdue status for pending/partially paid fees before returning
    const currentDate = new Date();
    await Fee.updateMany(
      { status: { $in: ['Pending', 'Partially Paid'] }, dueDate: { $lt: currentDate } },
      { $set: { status: 'Overdue' } }
    );

    const query = {};
    if (status) query.status = status;
    if (feeType) query.feeType = feeType;

    const fees = await Fee.find(query)
      .populate('student', 'personalDetails.firstName personalDetails.lastName academicDetails.admissionNumber')
      .sort('-createdAt');
      
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update fee details
// @route   PUT /api/fees/:id
// @access  Private (Admin/Accountant)
const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    const updatedFee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Fee updated successfully', fee: updatedFee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete fee record
// @route   DELETE /api/fees/:id
// @access  Private (Admin)
const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    await fee.deleteOne();
    res.json({ message: 'Fee record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateFee,
  payFee,
  getStudentFees,
  getAllFees,
  updateFee,
  deleteFee
};

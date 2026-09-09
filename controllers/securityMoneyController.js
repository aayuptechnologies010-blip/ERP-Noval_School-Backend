const SecurityMoney = require('../models/securityMoneyModel');
const Student = require('../models/studentModel');

// @desc    Deposit Security Money
// @route   POST /api/security-money/deposit
// @access  Private
const depositSecurityMoney = async (req, res) => {
  try {
    const { studentId, amount, paymentMode, remarks } = req.body;

    if (!studentId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Student ID and valid Amount are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const receiptNo = `SEC${Date.now()}`;

    const securityRecord = await SecurityMoney.create({
      student: studentId,
      amount: Number(amount),
      status: 'Deposited',
      receiptNo,
      paymentMode: paymentMode || 'Cash',
      remarks
    });

    res.status(201).json({ message: 'Security money deposited successfully', data: securityRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return Security Money
// @route   PUT /api/security-money/return/:id
// @access  Private
const returnSecurityMoney = async (req, res) => {
  try {
    const { remarks } = req.body;
    const record = await SecurityMoney.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Security record not found' });
    }

    if (record.status === 'Returned') {
      return res.status(400).json({ message: 'Security money is already returned' });
    }

    record.status = 'Returned';
    record.returnDate = Date.now();
    record.remarks = remarks ? `${record.remarks} | Returned: ${remarks}` : record.remarks;
    
    await record.save();

    res.status(200).json({ message: 'Security money returned successfully', data: record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Security Money by Student
// @route   GET /api/security-money/student/:studentId
// @access  Private
const getSecurityMoneyByStudent = async (req, res) => {
  try {
    const records = await SecurityMoney.find({ student: req.params.studentId }).sort('-depositDate');
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  depositSecurityMoney,
  returnSecurityMoney,
  getSecurityMoneyByStudent
};

const Bank = require('../models/bankModel');

// @desc    Create a new bank
// @route   POST /api/banks
// @access  Private
const createBank = async (req, res) => {
  try {
    const { bankName, accountNumber, mobile, address, ifscCode, bsrCode, isSchool } = req.body;

    if (!bankName) {
      return res.status(400).json({ message: 'Bank name is required' });
    }

    const bank = await Bank.create({
      bankName,
      accountNumber,
      mobile,
      address,
      ifscCode,
      bsrCode,
      isSchool: isSchool === true || isSchool === 'true'
    });

    res.status(201).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all banks
// @route   GET /api/banks
// @access  Private
const getBanks = async (req, res) => {
  try {
    const banks = await Bank.find({}).sort({ createdAt: -1 });
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bank by ID
// @route   GET /api/banks/:id
// @access  Private
const getBankById = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    res.status(200).json(bank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bank
// @route   PUT /api/banks/:id
// @access  Private
const updateBank = async (req, res) => {
  try {
    const { bankName, accountNumber, mobile, address, ifscCode, bsrCode, isSchool } = req.body;
    const bank = await Bank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    if (bankName) bank.bankName = bankName;
    if (accountNumber !== undefined) bank.accountNumber = accountNumber;
    if (mobile !== undefined) bank.mobile = mobile;
    if (address !== undefined) bank.address = address;
    if (ifscCode !== undefined) bank.ifscCode = ifscCode;
    if (bsrCode !== undefined) bank.bsrCode = bsrCode;
    if (isSchool !== undefined) bank.isSchool = isSchool === true || isSchool === 'true';

    const updatedBank = await bank.save();
    res.status(200).json(updatedBank);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bank
// @route   DELETE /api/banks/:id
// @access  Private
const deleteBank = async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);

    if (!bank) {
      return res.status(404).json({ message: 'Bank not found' });
    }

    await bank.deleteOne();
    res.status(200).json({ message: 'Bank removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBank,
  getBanks,
  getBankById,
  updateBank,
  deleteBank
};

const SalaryAccount = require('../models/salaryAccountModel');

// @desc    Get all salary accounts
// @route   GET /api/salary-accounts
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const accounts = await SalaryAccount.find().sort({ createdAt: -1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get salary account by ID
// @route   GET /api/salary-accounts/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const account = await SalaryAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Salary account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new salary account
// @route   POST /api/salary-accounts
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { accountName, bank, accountNo, branch, ifscCode, isActive } = req.body;
    if (!accountName || !bank || !accountNo) {
      return res.status(400).json({ message: 'Account Name, Bank and Account No are required' });
    }

    const newAccount = await SalaryAccount.create({
      accountName,
      bank,
      accountNo,
      branch: branch || '',
      ifscCode: ifscCode || '',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update salary account
// @route   PUT /api/salary-accounts/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const account = await SalaryAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Salary account not found' });
    }

    const { accountName, bank, accountNo, branch, ifscCode, isActive } = req.body;
    if (accountName !== undefined) account.accountName = accountName;
    if (bank !== undefined) account.bank = bank;
    if (accountNo !== undefined) account.accountNo = accountNo;
    if (branch !== undefined) account.branch = branch;
    if (ifscCode !== undefined) account.ifscCode = ifscCode;
    if (isActive !== undefined) account.isActive = isActive;

    const updated = await account.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary account
// @route   DELETE /api/salary-accounts/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const account = await SalaryAccount.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Salary account not found' });
    }

    await account.deleteOne();
    res.json({ message: 'Salary account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

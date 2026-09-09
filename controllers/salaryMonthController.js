const SalaryMonth = require('../models/salaryMonthModel');

// @desc    Get all salary months
// @route   GET /api/salary-months
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const months = await SalaryMonth.find().sort({ orderNo: 1 });
    res.json(months);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get salary month by ID
// @route   GET /api/salary-months/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const month = await SalaryMonth.findById(req.params.id);
    if (!month) {
      return res.status(404).json({ message: 'Salary month not found' });
    }
    res.json(month);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new salary month
// @route   POST /api/salary-months
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { orderNo, month, year, workingDays, totalDays, isActive } = req.body;
    if (!orderNo || !month || !year) {
      return res.status(400).json({ message: 'Order No, Month and Year are required' });
    }

    const newMonth = await SalaryMonth.create({
      orderNo: Number(orderNo),
      month,
      year: String(year),
      workingDays: workingDays !== undefined ? Number(workingDays) : 26,
      totalDays: totalDays !== undefined ? Number(totalDays) : 30,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(newMonth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update salary month
// @route   PUT /api/salary-months/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const salaryMonth = await SalaryMonth.findById(req.params.id);
    if (!salaryMonth) {
      return res.status(404).json({ message: 'Salary month not found' });
    }

    const { orderNo, month, year, workingDays, totalDays, isActive } = req.body;
    if (orderNo !== undefined) salaryMonth.orderNo = Number(orderNo);
    if (month !== undefined) salaryMonth.month = month;
    if (year !== undefined) salaryMonth.year = String(year);
    if (workingDays !== undefined) salaryMonth.workingDays = Number(workingDays);
    if (totalDays !== undefined) salaryMonth.totalDays = Number(totalDays);
    if (isActive !== undefined) salaryMonth.isActive = isActive;

    const updated = await salaryMonth.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary month
// @route   DELETE /api/salary-months/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const salaryMonth = await SalaryMonth.findById(req.params.id);
    if (!salaryMonth) {
      return res.status(404).json({ message: 'Salary month not found' });
    }

    await salaryMonth.deleteOne();
    res.json({ message: 'Salary month deleted successfully' });
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

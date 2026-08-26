const FinancialYear = require('../models/financialYearModel');

// @desc    Create a new financial year
// @route   POST /api/financial-years
// @access  Private (Admin/Manager)
const createFinancialYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isActive } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Name, start date, and end date are required' });
    }

    const yearExists = await FinancialYear.findOne({ name });
    if (yearExists) {
      return res.status(400).json({ message: 'Financial Year already exists' });
    }

    // If this one is set to active, deactivate all others
    if (isActive) {
      await FinancialYear.updateMany({}, { isActive: false });
    }

    const financialYear = await FinancialYear.create({
      name,
      startDate,
      endDate,
      isActive: isActive || false
    });

    res.status(201).json(financialYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all financial years
// @route   GET /api/financial-years
// @access  Private
const getFinancialYears = async (req, res) => {
  try {
    const financialYears = await FinancialYear.find({}).sort({ startDate: -1 });
    res.status(200).json(financialYears);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a financial year
// @route   PUT /api/financial-years/:id
// @access  Private
const updateFinancialYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isActive } = req.body;

    const financialYear = await FinancialYear.findById(req.params.id);

    if (!financialYear) {
      return res.status(404).json({ message: 'Financial Year not found' });
    }

    // Check if updating name and it already exists
    if (name && name !== financialYear.name) {
      const yearExists = await FinancialYear.findOne({ name });
      if (yearExists) {
        return res.status(400).json({ message: 'Financial Year name already in use' });
      }
    }

    // If changing to active, deactivate all others
    if (isActive && !financialYear.isActive) {
      await FinancialYear.updateMany({ _id: { $ne: financialYear._id } }, { isActive: false });
    }

    if (name) financialYear.name = name;
    if (startDate) financialYear.startDate = startDate;
    if (endDate) financialYear.endDate = endDate;
    if (isActive !== undefined) financialYear.isActive = isActive;

    const updatedFinancialYear = await financialYear.save();
    res.status(200).json(updatedFinancialYear);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a financial year
// @route   DELETE /api/financial-years/:id
// @access  Private
const deleteFinancialYear = async (req, res) => {
  try {
    const financialYear = await FinancialYear.findById(req.params.id);

    if (!financialYear) {
      return res.status(404).json({ message: 'Financial Year not found' });
    }

    // Prevent deletion of active financial year
    if (financialYear.isActive) {
      return res.status(400).json({ message: 'Cannot delete an active financial year. Please activate another year first.' });
    }

    await financialYear.deleteOne();
    res.status(200).json({ message: 'Financial Year removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFinancialYear,
  getFinancialYears,
  updateFinancialYear,
  deleteFinancialYear
};

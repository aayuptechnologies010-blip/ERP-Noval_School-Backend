const HeadRemark = require('../models/headRemarkModel');

// @desc    Get head remarks by filter
// @route   GET /api/head-remarks
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const { salaryMonth, salaryHead } = req.query;
    const filter = {};
    if (salaryMonth) filter.salaryMonth = salaryMonth;
    if (salaryHead) filter.salaryHead = salaryHead;

    const remarks = await HeadRemark.find(filter);
    res.json(remarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk save head remarks
// @route   PUT /api/head-remarks/bulk
// @access  Private (Admin)
const bulkSave = async (req, res) => {
  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'entries array is required' });
    }

    const bulkOps = entries.map(item => ({
      updateOne: {
        filter: {
          staffId: item.staffId,
          salaryMonth: item.salaryMonth,
          salaryHead: item.salaryHead
        },
        update: {
          $set: {
            staffName: item.staffName || '',
            staffCode: item.staffCode || '',
            amount: Number(item.amount) || 0,
            remark: item.remark || ''
          }
        },
        upsert: true
      }
    }));

    await HeadRemark.bulkWrite(bulkOps);
    res.json({ message: 'Head remarks saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  bulkSave
};

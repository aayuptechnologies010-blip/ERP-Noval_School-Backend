const SalaryHead = require('../models/salaryHeadModel');

// @desc    Get all salary heads
// @route   GET /api/salary-heads
// @access  Private (Admin)
const getAll = async (req, res) => {
  try {
    const heads = await SalaryHead.find().sort({ serial: 1 });
    res.json(heads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get salary head by ID
// @route   GET /api/salary-heads/:id
// @access  Private (Admin)
const getById = async (req, res) => {
  try {
    const head = await SalaryHead.findById(req.params.id);
    if (!head) {
      return res.status(404).json({ message: 'Salary head not found' });
    }
    res.json(head);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create salary head
// @route   POST /api/salary-heads
// @access  Private (Admin)
const create = async (req, res) => {
  try {
    const { serial, head, report, type, lwp, ot, vType, show, val, isActive } = req.body;
    if (!head || !report) {
      return res.status(400).json({ message: 'Head name and report name are required' });
    }

    let serialNum = serial;
    if (!serialNum) {
      const last = await SalaryHead.findOne().sort({ serial: -1 });
      serialNum = last ? last.serial + 1 : 1;
    }

    const newHead = await SalaryHead.create({
      serial: Number(serialNum),
      head,
      report,
      type: type || 'Allowance',
      lwp: !!lwp,
      ot: !!ot,
      vType: vType || 'Fixed',
      show: show !== undefined ? !!show : true,
      val: val !== undefined ? String(val) : '0.00',
      isActive: isActive !== undefined ? !!isActive : true
    });

    res.status(201).json(newHead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update salary head
// @route   PUT /api/salary-heads/:id
// @access  Private (Admin)
const update = async (req, res) => {
  try {
    const headItem = await SalaryHead.findById(req.params.id);
    if (!headItem) {
      return res.status(404).json({ message: 'Salary head not found' });
    }

    const { serial, head, report, type, lwp, ot, vType, show, val, isActive } = req.body;
    if (serial !== undefined) headItem.serial = Number(serial);
    if (head !== undefined) headItem.head = head;
    if (report !== undefined) headItem.report = report;
    if (type !== undefined) headItem.type = type;
    if (lwp !== undefined) headItem.lwp = !!lwp;
    if (ot !== undefined) headItem.ot = !!ot;
    if (vType !== undefined) headItem.vType = vType;
    if (show !== undefined) headItem.show = !!show;
    if (val !== undefined) headItem.val = String(val);
    if (isActive !== undefined) headItem.isActive = !!isActive;

    const updated = await headItem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete salary head
// @route   DELETE /api/salary-heads/:id
// @access  Private (Admin)
const remove = async (req, res) => {
  try {
    const headItem = await SalaryHead.findById(req.params.id);
    if (!headItem) {
      return res.status(404).json({ message: 'Salary head not found' });
    }

    await headItem.deleteOne();
    res.json({ message: 'Salary head deleted successfully' });
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

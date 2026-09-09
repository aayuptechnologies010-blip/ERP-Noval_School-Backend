const ProfessionalTaxSlab = require('../models/professionalTaxSlabModel');

// @desc    Get all professional tax slabs
// @route   GET /api/professional-tax-slabs
// @access  Private
const getAllSlabs = async (req, res) => {
  try {
    const { search, groupName, status } = req.query;
    const query = {};

    if (groupName && groupName !== 'All') {
      query.groupName = groupName;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { groupName: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    const slabs = await ProfessionalTaxSlab.find(query).sort({ groupName: 1, groupSlNo: 1, lowerBound: 1 });
    res.json(slabs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get distinct group names
// @route   GET /api/professional-tax-slabs/groups
// @access  Private
const getSlabGroups = async (req, res) => {
  try {
    const groups = await ProfessionalTaxSlab.distinct('groupName');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new professional tax slab
// @route   POST /api/professional-tax-slabs
// @access  Private
const createSlab = async (req, res) => {
  try {
    const { groupName, groupSlNo, lowerBound, upperBound, tax, applicableMonth, gender, status, remarks } = req.body;

    if (!groupName || lowerBound === undefined || upperBound === undefined || tax === undefined) {
      return res.status(400).json({ message: 'Group Name, Lower Bound, Upper Bound, and Tax are required' });
    }

    const slab = await ProfessionalTaxSlab.create({
      groupName: groupName.trim(),
      groupSlNo: Number(groupSlNo) || 1,
      lowerBound: Number(lowerBound) || 0,
      upperBound: Number(upperBound) || 0,
      tax: Number(tax) || 0,
      applicableMonth: applicableMonth || 'All',
      gender: gender || 'All',
      status: status || 'Active',
      remarks: remarks || ''
    });

    res.status(201).json(slab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update professional tax slab
// @route   PUT /api/professional-tax-slabs/:id
// @access  Private
const updateSlab = async (req, res) => {
  try {
    const { groupName, groupSlNo, lowerBound, upperBound, tax, applicableMonth, gender, status, remarks } = req.body;

    const slab = await ProfessionalTaxSlab.findById(req.params.id);
    if (!slab) {
      return res.status(404).json({ message: 'Tax slab not found' });
    }

    if (groupName) slab.groupName = groupName.trim();
    if (groupSlNo !== undefined) slab.groupSlNo = Number(groupSlNo) || 1;
    if (lowerBound !== undefined) slab.lowerBound = Number(lowerBound);
    if (upperBound !== undefined) slab.upperBound = Number(upperBound);
    if (tax !== undefined) slab.tax = Number(tax);
    if (applicableMonth) slab.applicableMonth = applicableMonth;
    if (gender) slab.gender = gender;
    if (status) slab.status = status;
    if (remarks !== undefined) slab.remarks = remarks;

    const updated = await slab.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete professional tax slab
// @route   DELETE /api/professional-tax-slabs/:id
// @access  Private
const deleteSlab = async (req, res) => {
  try {
    const slab = await ProfessionalTaxSlab.findByIdAndDelete(req.params.id);
    if (!slab) {
      return res.status(404).json({ message: 'Tax slab not found' });
    }
    res.json({ message: 'Professional tax slab deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSlabs,
  getSlabGroups,
  createSlab,
  updateSlab,
  deleteSlab
};

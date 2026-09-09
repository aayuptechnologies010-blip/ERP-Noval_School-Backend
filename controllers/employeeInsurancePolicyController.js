const EmployeeInsurancePolicy = require('../models/employeeInsurancePolicyModel');
const Staff = require('../models/staffModel');

// @desc    Get all employee insurance policies
// @route   GET /api/employee-insurance-policies
// @access  Private
const getAllPolicies = async (req, res) => {
  try {
    const { staffId, vendorName, status } = req.query;
    const filter = {};
    if (staffId) filter.staffId = staffId;
    if (vendorName) filter.vendorName = vendorName;
    if (status && status !== 'All') filter.status = status;

    const policies = await EmployeeInsurancePolicy.find(filter).sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/relate insurance policy with employee
// @route   POST /api/employee-insurance-policies
// @access  Private
const createPolicy = async (req, res) => {
  try {
    const { staffId, vendorId, vendorName, policyNo, policyName, premiumAmount, startDate, maturityDate, frequency, status, remarks } = req.body;

    if (!staffId || !policyNo || !vendorName || premiumAmount === undefined) {
      return res.status(400).json({ message: 'Staff ID, Vendor Name, Policy No, and Premium Amount are required' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const staffName = `${staff.firstName || ''} ${staff.middleName ? staff.middleName + ' ' : ''}${staff.lastName || ''}`.trim();
    const empNo = staff.empNo || staff.userName || '';

    const policy = await EmployeeInsurancePolicy.create({
      staffId: staff._id,
      staffName,
      empNo,
      vendorId: vendorId || null,
      vendorName: vendorName.trim(),
      policyNo: policyNo.trim(),
      policyName: policyName || '',
      premiumAmount: Number(premiumAmount) || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      maturityDate: maturityDate ? new Date(maturityDate) : null,
      frequency: frequency || 'Monthly',
      status: status || 'Active',
      remarks: remarks || ''
    });

    res.status(201).json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee insurance policy
// @route   PUT /api/employee-insurance-policies/:id
// @access  Private
const updatePolicy = async (req, res) => {
  try {
    const { vendorName, policyNo, policyName, premiumAmount, startDate, maturityDate, frequency, status, remarks } = req.body;

    const policy = await EmployeeInsurancePolicy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    if (vendorName) policy.vendorName = vendorName.trim();
    if (policyNo) policy.policyNo = policyNo.trim();
    if (policyName !== undefined) policy.policyName = policyName;
    if (premiumAmount !== undefined) policy.premiumAmount = Number(premiumAmount) || 0;
    if (startDate) policy.startDate = new Date(startDate);
    if (maturityDate !== undefined) policy.maturityDate = maturityDate ? new Date(maturityDate) : null;
    if (frequency) policy.frequency = frequency;
    if (status) policy.status = status;
    if (remarks !== undefined) policy.remarks = remarks;

    const updated = await policy.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee insurance policy
// @route   DELETE /api/employee-insurance-policies/:id
// @access  Private
const deletePolicy = async (req, res) => {
  try {
    const policy = await EmployeeInsurancePolicy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json({ message: 'Insurance policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk relate policy to multiple employees
// @route   POST /api/employee-insurance-policies/bulk-assign
// @access  Private
const bulkAssignPolicies = async (req, res) => {
  try {
    const { staffIds, vendorName, policyName, premiumAmount, startDate, maturityDate, frequency } = req.body;

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0 || !vendorName) {
      return res.status(400).json({ message: 'Staff IDs and Vendor Name are required' });
    }

    const staffs = await Staff.find({ _id: { $in: staffIds } });
    const docs = staffs.map((s, idx) => {
      const staffName = `${s.firstName || ''} ${s.middleName ? s.middleName + ' ' : ''}${s.lastName || ''}`.trim();
      const empNo = s.empNo || s.userName || '';
      const pNo = `POL-${vendorName.slice(0, 3).toUpperCase()}-${empNo || Math.floor(1000 + Math.random() * 9000)}`;

      return {
        staffId: s._id,
        staffName,
        empNo,
        vendorName: vendorName.trim(),
        policyNo: pNo,
        policyName: policyName || 'Group Insurance',
        premiumAmount: Number(premiumAmount) || 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        maturityDate: maturityDate ? new Date(maturityDate) : null,
        frequency: frequency || 'Monthly',
        status: 'Active',
        remarks: 'Bulk Assigned'
      };
    });

    const result = await EmployeeInsurancePolicy.insertMany(docs);
    res.status(201).json({ message: `Assigned policies to ${result.length} staff member(s)`, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  bulkAssignPolicies
};

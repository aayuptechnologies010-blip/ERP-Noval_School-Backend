const RejoinStaff = require('../models/rejoinStaffModel');
const Staff = require('../models/staffModel');

// @desc Get all rejoin history
// @route GET /api/rejoin-staff
const getAllRejoinHistory = async (req, res) => {
  try {
    const history = await RejoinStaff.find().sort({ rejoinDate: -1, createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Rejoin a staff member into active service
// @route POST /api/rejoin-staff
const rejoinStaffMember = async (req, res) => {
  try {
    const { staffId, newEmpNo, rejoinDate, designation, staffType, basicSalary, remarks } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: 'Staff ID is required' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const oldEmpNo = staff.empNo || staff.userName || '';
    const staffName = `${staff.firstName || ''} ${staff.middleName ? staff.middleName + ' ' : ''}${staff.lastName || ''}`.trim();

    // Update staff to Active status
    staff.salaryStatus = 'Active';
    staff.isActive = true;
    staff.rejoinDate = rejoinDate ? new Date(rejoinDate) : new Date();
    staff.leavingDate = null;
    staff.reasonOfLeaving = '';

    if (newEmpNo && newEmpNo.trim()) {
      staff.empNo = newEmpNo.trim();
      staff.userName = newEmpNo.trim();
    }
    if (designation) staff.designation = designation;
    if (staffType) staff.staffType = staffType;
    if (basicSalary !== undefined && basicSalary !== null) staff.basicSalary = Number(basicSalary);

    await staff.save();

    // Create log entry
    const log = await RejoinStaff.create({
      staffId: staff._id,
      staffName,
      oldEmpNo,
      newEmpNo: staff.empNo || staff.userName || '',
      rejoinDate: staff.rejoinDate,
      designation: staff.designation || '',
      staffType: staff.staffType || '',
      basicSalary: staff.basicSalary || 0,
      remarks: remarks || 'Rejoined active service',
      status: 'Rejoined'
    });

    res.status(201).json({
      message: `Staff ${staffName} has been successfully rejoined!`,
      staff,
      log
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a rejoin history record
// @route DELETE /api/rejoin-staff/:id
const deleteRejoinRecord = async (req, res) => {
  try {
    const record = await RejoinStaff.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Rejoin record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRejoinHistory,
  rejoinStaffMember,
  deleteRejoinRecord
};

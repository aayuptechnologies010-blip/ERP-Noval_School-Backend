const Staff = require('../models/staffModel');

// Helper to flatten nested objects for partial updates in Mongoose
const flattenObject = (ob) => {
  let toReturn = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;
    // Don't flatten arrays or nulls or Date objects
    if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i]) && !(ob[i] instanceof Date)) {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

// Helper to get uploaded file URL
const getFileUrl = (req, fieldName) => {
  if (req.file && req.file.fieldname === fieldName) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return '';
};

// @desc    Create a new staff member
// @route   POST /api/staff
// @access  Private (Admin)
const createStaff = async (req, res) => {
  try {
    let staffData = req.body;
    if (req.body.data) {
      staffData = JSON.parse(req.body.data);
    }

    // Check if user name (employee ID) already exists
    const existingStaff = await Staff.findOne({ userName: staffData.userName });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff with this User Name (ID) already exists' });
    }

    // Set a default password if not provided
    if (!staffData.password) {
      staffData.password = staffData.userName + '@123'; // Default password
    }

    const staff = new Staff(staffData);

    // Attach profile photo if uploaded
    if (req.file) {
      staff.staffPhoto = getFileUrl(req, 'staffPhoto');
    }

    const savedStaff = await staff.save();
    // Populate role before sending response if role exists
    if (savedStaff.role) {
      await savedStaff.populate('role', 'roleName');
    }
    
    res.status(201).json(savedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Admin)
const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().populate('role', 'roleName description');
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get staff member by ID
// @route   GET /api/staff/:id
// @access  Private (Admin)
const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).populate('role', 'roleName description');
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a staff member
// @route   PUT /api/staff/:id
// @access  Private (Admin)
const updateStaff = async (req, res) => {
  try {
    let staffData = req.body;
    if (req.body.data) {
      staffData = JSON.parse(req.body.data);
    }

    const staff = await Staff.findById(req.params.id);

    if (staff) {
      // Flatten the incoming data for partial update
      const flatData = flattenObject(staffData);
      staff.set(flatData);

      // Update photo if a new one is uploaded
      if (req.file) {
        staff.staffPhoto = getFileUrl(req, 'staffPhoto');
      }

      const updatedStaff = await staff.save();
      if (updatedStaff.role) {
        await updatedStaff.populate('role', 'roleName');
      }
      
      res.json(updatedStaff);
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      await staff.deleteOne();
      res.json({ message: 'Staff member removed successfully' });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a staff member's active status
// @route   PATCH /api/staffs/:id/status
// @access  Private (Admin)
const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      staff.isActive = !staff.isActive;
      const updatedStaff = await staff.save();
      res.json({ message: `Staff member status updated to ${updatedStaff.isActive ? 'Active' : 'Inactive'}`, isActive: updatedStaff.isActive });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all favorite staff members
// @route   GET /api/staffs/favorites
// @access  Private (Admin)
const getFavoriteStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find({ isFavorite: true }).populate('role', 'roleName description');
    res.json(staffMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle a staff member's favorite status
// @route   PATCH /api/staffs/:id/favorite
// @access  Private (Admin)
const toggleStaffFavorite = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
      staff.isFavorite = !staff.isFavorite;
      const updatedStaff = await staff.save();
      res.json({ message: `Staff member marked as ${updatedStaff.isFavorite ? 'Favorite' : 'Not Favorite'}`, isFavorite: updatedStaff.isFavorite });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign class teachers
// @route   PUT /api/staffs/bulk/assign-class-teacher
// @access  Private (Admin)
const bulkAssignClassTeacher = async (req, res) => {
  try {
    const { updates } = req.body; // Expecting [{ staffId: '...', assignedClass: '...', assignedSection: '...' }]

    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of updates in "updates" field.' });
    }

    const bulkOps = updates.map((update) => ({
      updateOne: {
        filter: { _id: update.staffId },
        update: { 
          $set: { 
            assignedClass: update.assignedClass,
            assignedSection: update.assignedSection
          } 
        }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Staff.bulkWrite(bulkOps);
      res.json({ message: 'Class teachers assigned successfully', result });
    } else {
      res.json({ message: 'No updates provided' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign salary account and/or staff type
// @route   PUT /api/staffs/bulk/assign-info
// @access  Private (Admin)
const bulkAssignInfo = async (req, res) => {
  try {
    const { staffIds, salaryAccount, staffType } = req.body;

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const updateFields = {};
    if (salaryAccount !== undefined) updateFields.salaryAccount = salaryAccount;
    if (staffType !== undefined) updateFields.staffType = staffType;

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { $set: updateFields }
    );

    res.json({ message: 'Bulk assignment completed successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign or remove salary group for staff
// @route   PUT /api/staffs/bulk/assign-salary-group
// @access  Private (Admin)
const bulkAssignSalaryGroup = async (req, res) => {
  try {
    const { staffIds, salaryGroup } = req.body;
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { $set: { salaryGroup: salaryGroup || '' } }
    );

    res.json({ message: 'Salary group updated successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign salary head to staff
// @route   PUT /api/staffs/bulk/assign-salary-head
// @access  Private (Admin)
const bulkAssignSalaryHead = async (req, res) => {
  try {
    const { staffIds, headName, value, valueType } = req.body;
    if (!staffIds || !Array.isArray(staffIds) || !headName) {
      return res.status(400).json({ message: 'staffIds and headName are required' });
    }

    const staffs = await Staff.find({ _id: { $in: staffIds } });
    for (let staff of staffs) {
      let heads = staff.salaryHeads || [];
      const idx = heads.findIndex(h => h.name === headName);
      if (idx > -1) {
        heads[idx].selected = true;
        if (value !== undefined) heads[idx].val = String(value);
        if (valueType !== undefined) heads[idx].type = valueType;
      } else {
        heads.push({
          id: heads.length + 1,
          name: headName,
          val: value !== undefined ? String(value) : '0.00',
          type: valueType || 'Fixed',
          selected: true
        });
      }
      staff.salaryHeads = heads;
      await staff.save();
    }

    res.json({ message: 'Salary heads assigned successfully to selected staff' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk update head amount entry for staff
// @route   PUT /api/staffs/bulk/salary-head-entry
// @access  Private (Admin)
const bulkSalaryHeadEntry = async (req, res) => {
  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'entries array is required' });
    }

    for (let item of entries) {
      const staff = await Staff.findById(item.staffId);
      if (staff) {
        let heads = staff.salaryHeads || [];
        const idx = heads.findIndex(h => h.name === item.headName);
        if (idx > -1) {
          heads[idx].val = String(item.val);
          heads[idx].selected = true;
        } else {
          heads.push({
            id: heads.length + 1,
            name: item.headName,
            val: String(item.val),
            type: 'Fixed',
            selected: true
          });
        }
        staff.salaryHeads = heads;
        await staff.save();
      }
    }

    res.json({ message: 'Salary head entries saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk relate IT Slab to staff
// @route   PUT /api/staffs/bulk/relate-it-slab
// @access  Private (Admin)
const bulkRelateITSlab = async (req, res) => {
  try {
    const { staffIds, taxRegime, itSlabGroup } = req.body;
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const updateFields = {};
    if (taxRegime !== undefined) updateFields.taxRegime = taxRegime;
    if (itSlabGroup !== undefined) updateFields.itSlabGroup = itSlabGroup;

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { $set: updateFields }
    );

    res.json({ message: 'IT Slab related to staff successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign pay scale, grade pay, basic salary to staff
// @route   PUT /api/staffs/bulk/assign-pay-scale
// @access  Private (Admin)
const bulkAssignPayScale = async (req, res) => {
  try {
    const { staffIds, payScale, gradePay, basicSalary, payScaleAmount } = req.body;
    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const updateFields = {};
    if (payScale !== undefined) updateFields.payScale = payScale;
    if (gradePay !== undefined) updateFields.gradePay = Number(gradePay) || 0;
    if (basicSalary !== undefined) updateFields.basicSalary = Number(basicSalary) || 0;
    if (payScaleAmount !== undefined) updateFields.payScaleAmount = Number(payScaleAmount) || 0;

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { $set: updateFields }
    );

    res.json({ message: 'Pay scale assigned to staff successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk modify staff details (designation, staffType, salaryStatus, generateSalary, salaryToBank, etc.)
// @route   PUT /api/staffs/bulk/modify
// @access  Private (Admin)
const bulkModifyStaff = async (req, res) => {
  try {
    const { updates, staffIds, fields } = req.body;

    // Case 1: Array of individual staff updates
    if (updates && Array.isArray(updates) && updates.length > 0) {
      const bulkOps = updates.map(item => {
        const setFields = {};
        if (item.designation !== undefined) setFields.designation = item.designation;
        if (item.staffType !== undefined) setFields.staffType = item.staffType;
        if (item.salaryStatus !== undefined) {
          setFields.salaryStatus = item.salaryStatus;
          setFields.isActive = item.salaryStatus === 'Active';
        }
        if (item.generateSalary !== undefined) setFields.generateSalary = Boolean(item.generateSalary);
        if (item.salaryToBank !== undefined) setFields.salaryToBank = Boolean(item.salaryToBank);
        if (item.contactNo !== undefined) setFields.contactNo = item.contactNo;
        if (item.bankName !== undefined) setFields.bankName = item.bankName;
        if (item.bankAccNo !== undefined) setFields.bankAccNo = item.bankAccNo;

        return {
          updateOne: {
            filter: { _id: item.staffId || item._id },
            update: { $set: setFields }
          }
        };
      });

      const result = await Staff.bulkWrite(bulkOps);
      return res.json({ message: 'Staff records updated successfully in bulk', result });
    }

    // Case 2: Apply common fields to a list of staffIds
    if (staffIds && Array.isArray(staffIds) && staffIds.length > 0 && fields) {
      const setFields = {};
      if (fields.designation !== undefined) setFields.designation = fields.designation;
      if (fields.staffType !== undefined) setFields.staffType = fields.staffType;
      if (fields.salaryStatus !== undefined) {
        setFields.salaryStatus = fields.salaryStatus;
        setFields.isActive = fields.salaryStatus === 'Active';
      }
      if (fields.generateSalary !== undefined) setFields.generateSalary = Boolean(fields.generateSalary);
      if (fields.salaryToBank !== undefined) setFields.salaryToBank = Boolean(fields.salaryToBank);

      const result = await Staff.updateMany(
        { _id: { $in: staffIds } },
        { $set: setFields }
      );
      return res.json({ message: 'Selected staff updated successfully', result });
    }

    res.status(400).json({ message: 'Either "updates" array or "staffIds" + "fields" is required' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk generate barcodes for staff
// @route   POST /api/staffs/bulk/generate-barcode
// @access  Private (Admin)
const bulkGenerateBarcode = async (req, res) => {
  try {
    const { staffIds } = req.body;
    const filter = (staffIds && Array.isArray(staffIds) && staffIds.length > 0)
      ? { _id: { $in: staffIds } }
      : {};

    const staffList = await Staff.find(filter);
    const bulkOps = staffList.map(s => {
      // Generate clean standard barcode format (e.g. STF072, STF001, or numeric 12-digit)
      const code = s.userName || s.empNo || s.prefNo || s._id.toString().slice(-4);
      const barcodeVal = `STF-${code.toUpperCase().replace(/[^A-Z0-9]/g, '')}`;

      return {
        updateOne: {
          filter: { _id: s._id },
          update: { $set: { barcode: barcodeVal } }
        }
      };
    });

    if (bulkOps.length > 0) {
      const result = await Staff.bulkWrite(bulkOps);
      res.json({ message: `Barcodes generated for ${bulkOps.length} staff member(s)`, result });
    } else {
      res.json({ message: 'No staff found to generate barcode' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk assign transport to staff
// @route   PUT /api/staffs/bulk/assign-transport
// @access  Private (Admin)
const bulkAssignTransport = async (req, res) => {
  try {
    const { staffIds, route, stop, vehicle, monthlyFee } = req.body;

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const transportData = {
      isTransport: true,
      route: route || '',
      stop: stop || '',
      vehicle: vehicle || '',
      monthlyFee: Number(monthlyFee) || 0,
      assignedDate: new Date()
    };

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { $set: { transportDetails: transportData } }
    );

    res.json({ message: 'Transport assigned to staff successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk remove transport from staff
// @route   PUT /api/staffs/bulk/remove-transport
// @access  Private (Admin)
const bulkRemoveTransport = async (req, res) => {
  try {
    const { staffIds } = req.body;

    if (!staffIds || !Array.isArray(staffIds) || staffIds.length === 0) {
      return res.status(400).json({ message: 'staffIds array is required' });
    }

    const result = await Staff.updateMany(
      { _id: { $in: staffIds } },
      { 
        $set: { 
          transportDetails: {
            isTransport: false,
            route: '',
            stop: '',
            vehicle: '',
            monthlyFee: 0,
            assignedDate: null
          } 
        } 
      }
    );

    res.json({ message: 'Transport removed from selected staff successfully', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all documents for a staff member
// @route   GET /api/staffs/:id/documents
// @access  Private
const getStaffDocuments = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staff.documents || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload document for a staff member
// @route   POST /api/staffs/:id/documents
// @access  Private
const uploadStaffDocument = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const { documentType, documentName, documentUrl, remarks } = req.body;
    let finalUrl = documentUrl || '';
    let fileName = '';
    let fileSize = 0;
    let mimeType = '';

    if (req.file) {
      finalUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      fileName = req.file.originalname || req.file.filename;
      fileSize = req.file.size;
      mimeType = req.file.mimetype;
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'Document file or documentUrl is required' });
    }

    const newDoc = {
      documentType: documentType || 'Other Document',
      documentName: documentName || fileName || 'Staff Document',
      documentUrl: finalUrl,
      fileName: fileName || 'document',
      fileSize,
      mimeType,
      uploadDate: new Date(),
      isVerified: false,
      remarks: remarks || ''
    };

    if (!staff.documents) {
      staff.documents = [];
    }
    staff.documents.unshift(newDoc);
    await staff.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: staff.documents[0],
      documents: staff.documents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify/Unverify staff document
// @route   PATCH /api/staffs/:id/documents/:docId/verify
// @access  Private
const verifyStaffDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const { isVerified, verifiedBy } = req.body;

    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const doc = staff.documents.id(docId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    doc.isVerified = isVerified !== undefined ? isVerified : !doc.isVerified;
    if (doc.isVerified) {
      doc.verifiedAt = new Date();
      doc.verifiedBy = verifiedBy || req.user?.userName || 'Admin';
    } else {
      doc.verifiedAt = null;
      doc.verifiedBy = '';
    }

    await staff.save();
    res.json({ message: 'Document verification updated', document: doc, documents: staff.documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete staff document
// @route   DELETE /api/staffs/:id/documents/:docId
// @access  Private
const deleteStaffDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const doc = staff.documents.id(docId);
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (doc.documentUrl && doc.documentUrl.includes('/uploads/')) {
      const path = require('path');
      const fs = require('fs');
      const filename = path.basename(doc.documentUrl);
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) { console.error('Error unlinking doc file:', e); }
      }
    }

    staff.documents.pull(docId);
    await staff.save();

    res.json({ message: 'Document deleted successfully', documents: staff.documents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  getFavoriteStaff,
  toggleStaffFavorite,
  bulkAssignClassTeacher,
  bulkAssignInfo,
  bulkAssignSalaryGroup,
  bulkAssignSalaryHead,
  bulkSalaryHeadEntry,
  bulkRelateITSlab,
  bulkAssignPayScale,
  bulkModifyStaff,
  bulkGenerateBarcode,
  bulkAssignTransport,
  bulkRemoveTransport,
  getStaffDocuments,
  uploadStaffDocument,
  verifyStaffDocument,
  deleteStaffDocument
};


const SchoolDoc = require('../models/schoolDocModel');

// @desc Get all school documents
// @route GET /api/school-documents
exports.getAllSchoolDocs = async (req, res) => {
  try {
    const list = await SchoolDoc.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create or upload school document record
// @route POST /api/school-documents
exports.createSchoolDoc = async (req, res) => {
  try {
    const { type, documentName, photo, status } = req.body;
    const doc = new SchoolDoc({
      type: type || 'School Affiliation Certificate',
      documentName: documentName || 'Certificate.pdf',
      photo: photo || '',
      status: status || 'Verified'
    });
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete school document
// @route DELETE /api/school-documents/:id
exports.deleteSchoolDoc = async (req, res) => {
  try {
    const deleted = await SchoolDoc.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

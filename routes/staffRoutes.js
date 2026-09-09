const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle, uploadDocument } = require('../middlewares/uploadMiddleware');

// All staff routes require admin authentication
router.use(protect);

router.route('/')
  .post(uploadSingle.single('staffPhoto'), createStaff)
  .get(getAllStaff);

// Bulk endpoints (must be before /:id)
router.put('/bulk/assign-class-teacher', bulkAssignClassTeacher);
router.put('/bulk/assign-info', bulkAssignInfo);
router.put('/bulk/assign-salary-group', bulkAssignSalaryGroup);
router.put('/bulk/assign-salary-head', bulkAssignSalaryHead);
router.put('/bulk/salary-head-entry', bulkSalaryHeadEntry);
router.put('/bulk/relate-it-slab', bulkRelateITSlab);
router.put('/bulk/assign-pay-scale', bulkAssignPayScale);
router.put('/bulk/modify', bulkModifyStaff);
router.post('/bulk/generate-barcode', bulkGenerateBarcode);
router.put('/bulk/assign-transport', bulkAssignTransport);
router.put('/bulk/remove-transport', bulkRemoveTransport);

// Get favorite staff (must be before /:id)
router.get('/favorites', getFavoriteStaff);

router.route('/:id')
  .get(getStaffById)
  .put(uploadSingle.single('staffPhoto'), updateStaff)
  .delete(deleteStaff);

router.route('/:id/status')
  .patch(toggleStaffStatus);

router.route('/:id/favorite')
  .patch(toggleStaffFavorite);

// Staff Document routes
router.route('/:id/documents')
  .get(getStaffDocuments)
  .post(uploadDocument.single('documentFile'), uploadStaffDocument);

router.route('/:id/documents/:docId')
  .delete(deleteStaffDocument);

router.route('/:id/documents/:docId/verify')
  .patch(verifyStaffDocument);

module.exports = router;

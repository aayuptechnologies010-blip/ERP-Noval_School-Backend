const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configure multer in-memory storage for Excel uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max
});

const {
  getStudentLedger,
  submitFeePayment,
  getAllReceipts,
  cancelFeeReceipt,
  deleteFeeReceipt,
  modifyFeeReceipt,
  manualModifyFeeReceipt,
  processRefund,
  adjustAdvance,
  updateChequeStatus,
  addManualFee,
  updateBulkReceiptMetadata,
  downloadSampleFeeExcel,
  uploadBulkFeesExcel
} = require('../controllers/feeTransactionController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/sample-template', downloadSampleFeeExcel);
router.post('/upload-excel', protect, upload.single('file'), uploadBulkFeesExcel);

router.get('/ledger/:studentId', protect, getStudentLedger);
router.post('/pay', protect, submitFeePayment);
router.get('/receipts', protect, getAllReceipts);
router.post('/add-manual-fee', protect, addManualFee);
router.put('/bulk-update-metadata', protect, updateBulkReceiptMetadata);
router.put('/cancel/:id', protect, cancelFeeReceipt);
router.delete('/:id', protect, deleteFeeReceipt);
router.put('/modify/:id', protect, modifyFeeReceipt);
router.put('/manual-modify/:id', protect, manualModifyFeeReceipt);
router.post('/refund', protect, processRefund);
router.post('/adjust-advance', protect, adjustAdvance);
router.put('/cheque-status/:id', protect, updateChequeStatus);

module.exports = router;


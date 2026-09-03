const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getDailyFeeCollection,
  getMonthWiseCollection,
  getTotalCollection,
  getDefaulterList
} = require('../controllers/feeReportController');

const {
  getCollectionSummary,
  getDefaulterStats,
  getTransactionHistory,
  getRevenueSummary,
  getEstimatedCollection,
  getRecentTransactions,
  getStudentHeadcount
} = require('../controllers/feeDashboardController');

const router = express.Router();

router.get('/collection/daily', protect, getDailyFeeCollection);
router.get('/collection/monthly', protect, getMonthWiseCollection);
router.get('/collection/total', protect, getTotalCollection);
router.get('/defaulters', protect, getDefaulterList);

// Dashboard routes
router.get('/dashboard/collection-summary', protect, getCollectionSummary);
router.get('/dashboard/defaulter-stats', protect, getDefaulterStats);
router.get('/dashboard/transaction-history', protect, getTransactionHistory);
router.get('/dashboard/revenue-summary', protect, getRevenueSummary);
router.get('/dashboard/estimated-collection', protect, getEstimatedCollection);
router.get('/dashboard/recent-transactions', protect, getRecentTransactions);
router.get('/dashboard/student-headcount', protect, getStudentHeadcount);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const {
  // Fix Advance Accounts
  getFixAdvanceAccounts,
  createFixAdvanceAccount,
  updateFixAdvanceAccount,
  deleteFixAdvanceAccount,

  // Advance Entries
  getAdvanceEntries,
  createAdvanceEntry,
  updateAdvanceEntry,
  deleteAdvanceEntry,

  // Advance Repayments
  getAdvanceRepayments,
  createAdvanceRepayment,
  deleteAdvanceRepayment,

  // Advance Ledger
  getAdvanceLedger
} = require('../controllers/advanceController');

// All Advance endpoints protected with JWT authentication
router.use(protect);

// 1. Fix Advance Accounts
router.route('/accounts')
  .get(getFixAdvanceAccounts)
  .post(createFixAdvanceAccount);
router.route('/accounts/:id')
  .put(updateFixAdvanceAccount)
  .delete(deleteFixAdvanceAccount);

// 2. Advance Entries (Disbursements)
router.route('/entries')
  .get(getAdvanceEntries)
  .post(createAdvanceEntry);
router.route('/entries/:id')
  .put(updateAdvanceEntry)
  .delete(deleteAdvanceEntry);

// 3. Advance Repayments
router.route('/repayments')
  .get(getAdvanceRepayments)
  .post(createAdvanceRepayment);
router.route('/repayments/:id')
  .delete(deleteAdvanceRepayment);

// 4. Advance Ledger Statement
router.route('/ledger')
  .get(getAdvanceLedger);

module.exports = router;

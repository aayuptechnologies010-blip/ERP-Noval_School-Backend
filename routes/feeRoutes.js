const express = require('express');
const router = express.Router();
const {
  generateFee,
  payFee,
  getStudentFees,
  getAllFees,
  updateFee,
  deleteFee
} = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(generateFee)
  .get(getAllFees);

router.route('/:id/pay')
  .post(payFee);

router.route('/student/:studentId')
  .get(getStudentFees);

router.route('/:id')
  .put(updateFee)
  .delete(deleteFee);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  generatePayslip,
  getMyPayslip,
} = require('../controllers/payslipController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', generatePayslip);
router.get('/my-payslip', getMyPayslip);

module.exports = router;

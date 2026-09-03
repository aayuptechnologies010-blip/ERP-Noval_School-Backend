const express = require('express');
const router = express.Router();
const {
  depositSecurityMoney,
  returnSecurityMoney,
  getSecurityMoneyByStudent
} = require('../controllers/securityMoneyController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/deposit', protect, depositSecurityMoney);
router.put('/return/:id', protect, returnSecurityMoney);
router.get('/student/:studentId', protect, getSecurityMoneyByStudent);

module.exports = router;

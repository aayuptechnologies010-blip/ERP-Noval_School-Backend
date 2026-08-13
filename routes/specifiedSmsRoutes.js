const express = require('express');
const router = express.Router();
const {
  sendSpecifiedSms,
  getAllSpecifiedSms,
  getSpecifiedSmsById,
  deleteSpecifiedSms
} = require('../controllers/specifiedSmsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(sendSpecifiedSms)
  .get(getAllSpecifiedSms);

router.route('/:id')
  .get(getSpecifiedSmsById)
  .delete(deleteSpecifiedSms);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getConcessions, saveConcessions } = require('../controllers/feeHeadConcessionController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getConcessions)
  .post(protect, saveConcessions);

module.exports = router;

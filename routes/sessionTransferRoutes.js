const express = require('express');
const router = express.Router();
const { transferSession } = require('../controllers/sessionTransferController');

router.route('/')
  .post(transferSession);

module.exports = router;

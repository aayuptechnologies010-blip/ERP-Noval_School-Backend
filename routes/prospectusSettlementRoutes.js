const express = require('express');
const router = express.Router();
const {
  getAllSettlements,
  createSettlement
} = require('../controllers/prospectusSettlementController');

router.route('/')
  .get(getAllSettlements)
  .post(createSettlement);

module.exports = router;

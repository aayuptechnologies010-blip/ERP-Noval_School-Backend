const express = require('express');
const router = express.Router();
const {
  getAllFees,
  collectFee,
  getAllStructures,
  saveStructure
} = require('../controllers/admissionFeeController');

router.route('/')
  .get(getAllFees)
  .post(collectFee);

router.route('/structures')
  .get(getAllStructures)
  .post(saveStructure);

module.exports = router;

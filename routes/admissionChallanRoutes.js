const express = require('express');
const router = express.Router();
const {
  getAllChallans,
  createChallan
} = require('../controllers/admissionChallanController');

router.route('/')
  .get(getAllChallans)
  .post(createChallan);

module.exports = router;

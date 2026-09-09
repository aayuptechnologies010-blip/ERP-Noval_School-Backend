const express = require('express');
const router = express.Router();
const {
  getStudentsForList,
  updateManualList
} = require('../controllers/manualListController');

router.route('/')
  .get(getStudentsForList)
  .put(updateManualList);

module.exports = router;

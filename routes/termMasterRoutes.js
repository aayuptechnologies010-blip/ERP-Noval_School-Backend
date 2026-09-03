const express = require('express');
const router = express.Router();
const {
  createTermMaster,
  getTermMasters,
  getTermMasterById,
  updateTermMaster,
  deleteTermMaster
} = require('../controllers/termMasterController');

router.route('/')
  .post(createTermMaster)
  .get(getTermMasters);

router.route('/:id')
  .get(getTermMasterById)
  .put(updateTermMaster)
  .delete(deleteTermMaster);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createReason,
  getReasons,
  getReasonById,
  updateReason,
  deleteReason
} = require('../controllers/reasonController');

router.route('/')
  .post(createReason)
  .get(getReasons);

router.route('/:id')
  .get(getReasonById)
  .put(updateReason)
  .delete(deleteReason);

module.exports = router;

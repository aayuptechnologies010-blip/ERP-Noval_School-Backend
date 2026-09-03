const express = require('express');
const router = express.Router();
const {
  createLastResult,
  getLastResults,
  getLastResultById,
  updateLastResult,
  deleteLastResult
} = require('../controllers/lastResultController');

router.route('/')
  .post(createLastResult)
  .get(getLastResults);

router.route('/:id')
  .get(getLastResultById)
  .put(updateLastResult)
  .delete(deleteLastResult);

module.exports = router;

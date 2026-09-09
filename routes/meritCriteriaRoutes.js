const express = require('express');
const router = express.Router();
const {
  getAllCriteria,
  createCriteria,
  updateCriteria,
  deleteCriteria
} = require('../controllers/meritCriteriaController');

router.route('/')
  .get(getAllCriteria)
  .post(createCriteria);

router.route('/:id')
  .put(updateCriteria)
  .delete(deleteCriteria);

module.exports = router;

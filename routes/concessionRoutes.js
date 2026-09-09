const express = require('express');
const router = express.Router();
const { getConcessions, createConcession, updateConcession, deleteConcession } = require('../controllers/concessionController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getConcessions)
  .post(protect, createConcession);

router.route('/:id')
  .put(protect, updateConcession)
  .delete(protect, deleteConcession);

module.exports = router;

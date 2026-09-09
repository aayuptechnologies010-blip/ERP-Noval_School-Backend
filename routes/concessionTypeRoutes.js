const express = require('express');
const router = express.Router();
const { getConcessionTypes, createConcessionType, updateConcessionType, deleteConcessionType } = require('../controllers/concessionTypeController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getConcessionTypes)
  .post(protect, createConcessionType);

router.route('/:id')
  .put(protect, updateConcessionType)
  .delete(protect, deleteConcessionType);

module.exports = router;

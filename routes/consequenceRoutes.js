const express = require('express');
const router = express.Router();
const {
  createConsequence,
  getConsequences,
  getConsequenceById,
  updateConsequence,
  deleteConsequence
} = require('../controllers/consequenceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getConsequences)
  .post(createConsequence);

router.route('/:id')
  .get(getConsequenceById)
  .put(updateConsequence)
  .delete(deleteConsequence);

module.exports = router;

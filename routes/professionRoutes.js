const express = require('express');
const router = express.Router();
const {
  createProfession,
  getProfessions,
  updateProfession,
  deleteProfession
} = require('../controllers/professionController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, createProfession)
  .get(protect, getProfessions);

router.route('/:id')
  .put(protect, updateProfession)
  .delete(protect, deleteProfession);

module.exports = router;

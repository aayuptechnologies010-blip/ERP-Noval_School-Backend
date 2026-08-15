const express = require('express');
const router = express.Router();
const {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought
} = require('../controllers/thoughtController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getThoughts)
  .post(createThought);

router.route('/:id')
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

module.exports = router;

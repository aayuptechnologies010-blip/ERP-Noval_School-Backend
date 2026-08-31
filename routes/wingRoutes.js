const express = require('express');
const router = express.Router();
const {
  createWing,
  getWings,
  getWingById,
  updateWing,
  deleteWing
} = require('../controllers/wingController');

router.route('/')
  .post(createWing)
  .get(getWings);

router.route('/:id')
  .get(getWingById)
  .put(updateWing)
  .delete(deleteWing);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createParish,
  getParishes,
  updateParish,
  deleteParish
} = require('../controllers/parishController');

router.route('/')
  .post(createParish)
  .get(getParishes);

router.route('/:id')
  .put(updateParish)
  .delete(deleteParish);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createReligion,
  getReligions,
  updateReligion,
  deleteReligion
} = require('../controllers/religionController');

router.route('/')
  .post(createReligion)
  .get(getReligions);

router.route('/:id')
  .put(updateReligion)
  .delete(deleteReligion);

module.exports = router;

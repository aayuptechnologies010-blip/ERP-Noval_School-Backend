const express = require('express');
const router = express.Router();
const {
  createMotherTongue,
  getMotherTongues,
  getMotherTongueById,
  updateMotherTongue,
  deleteMotherTongue
} = require('../controllers/motherTongueController');

router.route('/')
  .post(createMotherTongue)
  .get(getMotherTongues);

router.route('/:id')
  .get(getMotherTongueById)
  .put(updateMotherTongue)
  .delete(deleteMotherTongue);

module.exports = router;

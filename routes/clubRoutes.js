const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub
} = require('../controllers/clubController');

router.route('/')
  .post(createClub)
  .get(getClubs);

router.route('/:id')
  .get(getClubById)
  .put(updateClub)
  .delete(deleteClub);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createCommittee,
  getCommittees,
  getCommitteeById,
  updateCommittee,
  deleteCommittee
} = require('../controllers/committeeController');

router.route('/')
  .post(createCommittee)
  .get(getCommittees);

router.route('/:id')
  .get(getCommitteeById)
  .put(updateCommittee)
  .delete(deleteCommittee);

module.exports = router;

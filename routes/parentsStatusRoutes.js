const express = require('express');
const router = express.Router();
const {
  createParentsStatus,
  getParentsStatuses,
  getParentsStatusById,
  updateParentsStatus,
  deleteParentsStatus
} = require('../controllers/parentsStatusController');

router.route('/')
  .post(createParentsStatus)
  .get(getParentsStatuses);

router.route('/:id')
  .get(getParentsStatusById)
  .put(updateParentsStatus)
  .delete(deleteParentsStatus);

module.exports = router;

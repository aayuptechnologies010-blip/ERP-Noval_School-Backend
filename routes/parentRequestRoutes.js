const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  createRequest,
  updateRequestStatus
} = require('../controllers/parentRequestController');

router.route('/')
  .get(getAllRequests)
  .post(createRequest);

router.put('/:id/status', updateRequestStatus);

module.exports = router;

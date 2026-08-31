const express = require('express');
const router = express.Router();
const {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream
} = require('../controllers/streamController');

router.route('/')
  .post(createStream)
  .get(getStreams);

router.route('/:id')
  .get(getStreamById)
  .put(updateStream)
  .delete(deleteStream);

module.exports = router;

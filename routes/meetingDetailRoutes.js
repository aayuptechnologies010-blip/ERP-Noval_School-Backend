const express = require('express');
const router = express.Router();
const {
  createMeetingDetail,
  getMeetingDetails,
  getMeetingDetailById,
  updateMeetingDetail,
  deleteMeetingDetail
} = require('../controllers/meetingDetailController');

router.route('/')
  .post(createMeetingDetail)
  .get(getMeetingDetails);

router.route('/:id')
  .get(getMeetingDetailById)
  .put(updateMeetingDetail)
  .delete(deleteMeetingDetail);

module.exports = router;

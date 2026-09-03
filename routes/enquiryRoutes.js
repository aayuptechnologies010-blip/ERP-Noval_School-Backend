const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getLastEnquiryNumber,
  addFollowUp
} = require('../controllers/enquiryController');

// Note: /last-number/generate must come before /:id to prevent it from being parsed as an ID
router.get('/last-number/generate', getLastEnquiryNumber);

router.route('/')
  .post(createEnquiry)
  .get(getEnquiries);

router.route('/:id')
  .get(getEnquiryById)
  .put(updateEnquiry)
  .delete(deleteEnquiry);

router.post('/:id/follow-ups', addFollowUp);

module.exports = router;

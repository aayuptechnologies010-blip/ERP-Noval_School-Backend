const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createInquiry)
  .get(getAllInquiries);

router.route('/:id')
  .get(getInquiryById)
  .put(updateInquiry)
  .delete(deleteInquiry);

module.exports = router;

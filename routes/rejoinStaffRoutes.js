const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllRejoinHistory,
  rejoinStaffMember,
  deleteRejoinRecord
} = require('../controllers/rejoinStaffController');

router.use(protect);

router.route('/')
  .get(getAllRejoinHistory)
  .post(rejoinStaffMember);

router.route('/:id')
  .delete(deleteRejoinRecord);

module.exports = router;

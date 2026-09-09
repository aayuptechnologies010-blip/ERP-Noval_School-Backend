const express = require('express');
const router = express.Router();
const {
  createLeaveType,
  getLeaveTypes,
  updateLeaveType,
  deleteLeaveType
} = require('../controllers/leaveTypeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createLeaveType)
  .get(getLeaveTypes);

router.route('/:id')
  .put(updateLeaveType)
  .delete(deleteLeaveType);

module.exports = router;

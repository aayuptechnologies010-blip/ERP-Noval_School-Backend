const express = require('express');
const router = express.Router();
const {
  createStaffLeave,
  getAllStaffLeaves,
  updateStaffLeaveStatus,
  deleteStaffLeave,
  getStaffLeaveStats,
} = require('../controllers/staffLeaveController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/stats', getStaffLeaveStats);

router.route('/')
  .post(createStaffLeave)
  .get(getAllStaffLeaves);

router.route('/:id')
  .delete(deleteStaffLeave);

router.patch('/:id/status', updateStaffLeaveStatus);

module.exports = router;

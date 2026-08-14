const express = require('express');
const router = express.Router();
const {
  createTask,
  getMyTasks,
  markTaskDone,
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Create task
router.post('/', createTask);

// Get my tasks
router.get('/my-tasks', getMyTasks);

// Mark task done
router.patch('/:id/done', markTaskDone);

module.exports = router;

const Task = require('../models/taskModel');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { assignedTo, taskDescription, type, dueDate, status } = req.body;

    if (!assignedTo || !taskDescription || !type || !dueDate) {
      return res.status(400).json({
        message: 'assignedTo, taskDescription, type, and dueDate are required.',
      });
    }

    const task = new Task({
      assignedTo,
      taskDescription,
      type,
      dueDate,
      status: status || 'Pending',
      assignedBy: req.user?._id || null,
    });

    const savedTask = await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending tasks for a specific user
// @route   GET /api/tasks/my-tasks?userId=123
// @access  Private
const getMyTasks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required.' });
    }

    // Optional: auto-update overdue tasks before fetching
    const now = new Date();
    await Task.updateMany(
      { assignedTo: userId, status: 'Pending', dueDate: { $lt: now } },
      { $set: { status: 'Overdue' } }
    );

    // Fetch tasks
    const tasks = await Task.find({ assignedTo: userId, status: { $in: ['Pending', 'Overdue'] } })
      .sort({ dueDate: 1 }); // Sort by closest due date

    res.json({
      success: true,
      count: tasks.length,
      records: tasks.map(t => ({
        id: t._id,
        taskDescription: t.taskDescription,
        type: t.type,
        dueDate: t.dueDate.toISOString().split('T')[0],
        status: t.status,
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a task as done
// @route   PATCH /api/tasks/:id/done
// @access  Private
const markTaskDone = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.status = 'Done';
    const updatedTask = await task.save();

    res.json({
      message: 'Task marked as done successfully',
      task: {
        id: updatedTask._id,
        taskDescription: updatedTask.taskDescription,
        status: updatedTask.status,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getMyTasks,
  markTaskDone,
};

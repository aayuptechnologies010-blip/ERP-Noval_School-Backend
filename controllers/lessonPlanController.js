const LessonPlan = require('../models/lessonPlanModel');

// @desc    Create a new lesson plan
// @route   POST /api/lesson-plans
// @access  Private
const createLessonPlan = async (req, res) => {
  try {
    const data = req.body;
    
    const lessonPlan = new LessonPlan({
      ...data,
      createdBy: req.user?._id
    });

    const saved = await lessonPlan.save();
    res.status(201).json({ message: 'Lesson Plan created successfully', lessonPlan: saved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lesson plans
// @route   GET /api/lesson-plans
// @access  Private
const getAllLessonPlans = async (req, res) => {
  try {
    const lessonPlans = await LessonPlan.find().sort({ createdAt: -1 });
    res.json(lessonPlans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lesson plan by ID
// @route   GET /api/lesson-plans/:id
// @access  Private
const getLessonPlanById = async (req, res) => {
  try {
    const lessonPlan = await LessonPlan.findById(req.params.id);
    if (!lessonPlan) return res.status(404).json({ message: 'Lesson Plan not found' });
    res.json(lessonPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lesson plan
// @route   PUT /api/lesson-plans/:id
// @access  Private
const updateLessonPlan = async (req, res) => {
  try {
    const data = req.body;
    const lessonPlan = await LessonPlan.findById(req.params.id);
    
    if (!lessonPlan) return res.status(404).json({ message: 'Lesson Plan not found' });

    Object.keys(data).forEach(key => {
      lessonPlan[key] = data[key];
    });

    const updated = await lessonPlan.save();
    res.json({ message: 'Lesson Plan updated successfully', lessonPlan: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lesson plan
// @route   DELETE /api/lesson-plans/:id
// @access  Private
const deleteLessonPlan = async (req, res) => {
  try {
    const lessonPlan = await LessonPlan.findByIdAndDelete(req.params.id);
    if (!lessonPlan) return res.status(404).json({ message: 'Lesson Plan not found' });
    res.json({ message: 'Lesson Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLessonPlan,
  getAllLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan
};

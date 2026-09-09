const express = require('express');
const router = express.Router();
const {
  getTotalApplicants,
  createSlot,
  getSlots,
  getSlotById,
  updateSlot,
  deleteSlot
} = require('../controllers/slotCreationController');

// Make sure to put specific routes before parameterized routes
router.get('/total-applicants', getTotalApplicants);

router.route('/')
  .post(createSlot)
  .get(getSlots);

router.route('/:id')
  .get(getSlotById)
  .put(updateSlot)
  .delete(deleteSlot);

module.exports = router;

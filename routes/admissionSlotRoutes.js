const express = require('express');
const router = express.Router();
const {
  getAllSlots,
  createSlot,
  updateApplicantPoints,
  reslotApplicant,
  deleteSlot
} = require('../controllers/admissionSlotController');

router.route('/')
  .get(getAllSlots)
  .post(createSlot);

router.post('/re-slot', reslotApplicant);

router.route('/:id')
  .delete(deleteSlot);

router.put('/:id/applicant-points', updateApplicantPoints);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createProspectusEntry,
  getProspectusEntries,
  getProspectusEntryById,
  updateProspectusEntry,
  deleteProspectusEntry
} = require('../controllers/prospectusEntryController');

router.route('/')
  .post(createProspectusEntry)
  .get(getProspectusEntries);

router.route('/:id')
  .get(getProspectusEntryById)
  .put(updateProspectusEntry)
  .delete(deleteProspectusEntry);

module.exports = router;

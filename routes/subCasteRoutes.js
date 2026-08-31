const express = require('express');
const router = express.Router();
const {
  createSubCaste,
  getSubCastes,
  updateSubCaste,
  deleteSubCaste
} = require('../controllers/subCasteController');

router.route('/')
  .post(createSubCaste)
  .get(getSubCastes);

router.route('/:id')
  .put(updateSubCaste)
  .delete(deleteSubCaste);

module.exports = router;

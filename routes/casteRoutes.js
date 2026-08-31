const express = require('express');
const router = express.Router();
const {
  createCaste,
  getCastes,
  updateCaste,
  deleteCaste
} = require('../controllers/casteController');

router.route('/')
  .post(createCaste)
  .get(getCastes);

router.route('/:id')
  .put(updateCaste)
  .delete(deleteCaste);

module.exports = router;

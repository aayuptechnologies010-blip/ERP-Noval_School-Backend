const express = require('express');
const router = express.Router();
const {
  addResult,
  getStudentResults,
  getClassResults,
  deleteResult
} = require('../controllers/resultController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(addResult);

router.route('/class')
  .get(getClassResults);

router.route('/student/:studentId')
  .get(getStudentResults);

router.route('/:id')
  .delete(deleteResult);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createRemark,
  getRemarks,
  getRemarkById,
  updateRemark,
  deleteRemark
} = require('../controllers/remarkController');

router.route('/')
  .post(createRemark)
  .get(getRemarks);

router.route('/:id')
  .get(getRemarkById)
  .put(updateRemark)
  .delete(deleteRemark);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllMeritLists,
  createMeritList,
  getMeritListById,
  deleteMeritList
} = require('../controllers/meritListController');

router.route('/')
  .get(getAllMeritLists)
  .post(createMeritList);

router.route('/:id')
  .get(getMeritListById)
  .delete(deleteMeritList);

module.exports = router;

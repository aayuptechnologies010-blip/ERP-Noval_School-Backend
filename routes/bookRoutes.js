const express = require('express');
const router = express.Router();
const {
  createBook,
  getAllBooks,
  requestBook,
} = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createBook)
  .get(getAllBooks);

router.patch('/:id/request', requestBook);

module.exports = router;

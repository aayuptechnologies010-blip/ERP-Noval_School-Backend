const express = require('express');
const router = express.Router();
const {
  getAll,
  getPrimary,
  create,
  update,
  remove
} = require('../controllers/tdsDeducteeController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/primary', getPrimary);

router.route('/')
  .get(getAll)
  .post(create);

router.route('/:id')
  .put(update)
  .delete(remove);

module.exports = router;

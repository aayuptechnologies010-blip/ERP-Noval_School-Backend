const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAll, getById, create, update, remove } = require('../controllers/salaryMonthController');

router.use(protect);
router.route('/').get(getAll).post(create);
router.route('/:id').get(getById).put(update).delete(remove);

module.exports = router;

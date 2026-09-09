const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAll, getById, create, update, saveGroupHeads, remove } = require('../controllers/salaryGroupController');

router.use(protect);
router.route('/').get(getAll).post(create);
router.route('/:id').get(getById).put(update).delete(remove);
router.route('/:id/heads').put(saveGroupHeads);

module.exports = router;

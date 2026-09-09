const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAll, getById, create, update, saveCells, remove } = require('../controllers/cpcLevelController');

router.use(protect);
router.route('/').get(getAll).post(create);
router.route('/:id').get(getById).put(update).delete(remove);
router.route('/:id/cells').put(saveCells);

module.exports = router;

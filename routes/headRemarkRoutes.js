const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAll, bulkSave } = require('../controllers/headRemarkController');

router.use(protect);
router.route('/').get(getAll);
router.route('/bulk').put(bulkSave);

module.exports = router;

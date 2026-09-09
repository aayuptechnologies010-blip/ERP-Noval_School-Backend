const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getAll, bulkUpdate } = require('../controllers/relateStaticDynamicHeadController');

router.use(protect);
router.route('/')
  .get(getAll)
  .put(bulkUpdate);

module.exports = router;

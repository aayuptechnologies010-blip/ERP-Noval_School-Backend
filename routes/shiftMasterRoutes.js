const express = require('express');
const router = express.Router();
const {
  createShiftMaster,
  getShiftMasters,
  updateShiftMaster,
  deleteShiftMaster
} = require('../controllers/shiftMasterController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(createShiftMaster)
  .get(getShiftMasters);

router.route('/:id')
  .put(updateShiftMaster)
  .delete(deleteShiftMaster);

module.exports = router;

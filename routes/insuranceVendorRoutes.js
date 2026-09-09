const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/insuranceVendorController');

router.use(protect);

router.route('/')
  .get(getAllVendors)
  .post(createVendor);

router.route('/:id')
  .put(updateVendor)
  .delete(deleteVendor);

module.exports = router;

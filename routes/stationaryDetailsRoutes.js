const express = require('express');
const router = express.Router();
const {
  createStationaryDetails,
  getStationaryDetails,
  getStationaryDetailsById,
  updateStationaryDetails,
  deleteStationaryDetails
} = require('../controllers/stationaryDetailsController');

router.route('/')
  .post(createStationaryDetails)
  .get(getStationaryDetails);

router.route('/:id')
  .get(getStationaryDetailsById)
  .put(updateStationaryDetails)
  .delete(deleteStationaryDetails);

module.exports = router;

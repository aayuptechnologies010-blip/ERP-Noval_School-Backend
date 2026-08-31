const express = require('express');
const router = express.Router();
const {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse
} = require('../controllers/houseController');

router.route('/')
  .post(createHouse)
  .get(getHouses);

router.route('/:id')
  .get(getHouseById)
  .put(updateHouse)
  .delete(deleteHouse);

module.exports = router;

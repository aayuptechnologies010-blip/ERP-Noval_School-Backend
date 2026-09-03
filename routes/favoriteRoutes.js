const express = require('express');
const router = express.Router();
const { getFavorites, updateFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getFavorites)
  .put(updateFavorites);

module.exports = router;

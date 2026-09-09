const express = require('express');
const router = express.Router();
const {
  getMarksDashboardStats,
  updateMarksDashboardStats
} = require('../controllers/marksDashboardController');

// GET dashboard statistics
router.get('/dashboard-stats', getMarksDashboardStats);

// POST update statistics
router.post('/dashboard-stats', updateMarksDashboardStats);

module.exports = router;

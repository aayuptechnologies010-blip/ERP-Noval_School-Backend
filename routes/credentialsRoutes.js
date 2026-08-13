const express = require('express');
const router = express.Router();
const { sendCredentials, getCredentialLogs } = require('../controllers/credentialsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/send', sendCredentials);
router.get('/logs', getCredentialLogs);

module.exports = router;

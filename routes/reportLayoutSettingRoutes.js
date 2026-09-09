const express = require('express');
const router = express.Router();
const { create, getAll, update, remove } = require('../controllers/reportLayoutSettingController');

router.route('/').get(getAll).post(create);
router.route('/:id').put(update).delete(remove);

module.exports = router;
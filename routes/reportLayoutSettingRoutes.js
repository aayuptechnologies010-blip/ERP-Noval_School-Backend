const express = require('express');
const router = express.Router();
const {
  create,
  getAll,
  getById,
  update,
  remove
} = require('../controllers/reportLayoutSettingController');

router.route('/')
  .post(create)
  .get(getAll);

router.route('/:id')
  .get(getById)
  .put(update)
  .delete(remove);

module.exports = router;
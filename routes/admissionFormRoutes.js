const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, remove, bulkUpdate } = require('../controllers/admissionFormController');

router.route('/bulk-update')
  .put(bulkUpdate);

router.route('/')
  .get(getAll)
  .post(create);

router.route('/:id')
  .get(getById)
  .put(update)
  .delete(remove);

module.exports = router;

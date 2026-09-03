const express = require('express');
const router = express.Router();
const {
  getDropdownOptions,
  getUserPermission,
  updateUserPermission
} = require('../controllers/userPermissionController');

router.route('/options').get(getDropdownOptions);
router.route('/:userId')
  .get(getUserPermission)
  .post(updateUserPermission);

module.exports = router;

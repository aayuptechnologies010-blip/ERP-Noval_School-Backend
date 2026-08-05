const express = require('express');
const router = express.Router();
const {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  toggleRoleStatus,
  deleteRole
} = require('../controllers/roleController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all role routes - only authenticated admins can access them
router.use(protect);

router.route('/')
  .post(createRole)
  .get(getRoles);

router.route('/:id')
  .get(getRoleById)
  .put(updateRole)
  .delete(deleteRole);

router.patch('/:id/status', toggleRoleStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
  bulkAssignPolicies
} = require('../controllers/employeeInsurancePolicyController');

router.use(protect);

router.route('/')
  .get(getAllPolicies)
  .post(createPolicy);

router.post('/bulk-assign', bulkAssignPolicies);

router.route('/:id')
  .put(updatePolicy)
  .delete(deletePolicy);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createInfraction,
  getInfractions,
  getInfractionById,
  updateInfraction,
  deleteInfraction
} = require('../controllers/infractionController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(getInfractions)
  .post(createInfraction);

router.route('/:id')
  .get(getInfractionById)
  .put(updateInfraction)
  .delete(deleteInfraction);

module.exports = router;

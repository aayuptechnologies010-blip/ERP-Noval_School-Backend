const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllSlabs,
  getSlabGroups,
  createSlab,
  updateSlab,
  deleteSlab
} = require('../controllers/professionalTaxSlabController');

router.use(protect);

router.route('/')
  .get(getAllSlabs)
  .post(createSlab);

router.get('/groups', getSlabGroups);

router.route('/:id')
  .put(updateSlab)
  .delete(deleteSlab);

module.exports = router;

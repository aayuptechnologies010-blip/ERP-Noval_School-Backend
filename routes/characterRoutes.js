const express = require('express');
const router = express.Router();
const {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter
} = require('../controllers/characterController');

router.route('/')
  .post(createCharacter)
  .get(getCharacters);

router.route('/:id')
  .get(getCharacterById)
  .put(updateCharacter)
  .delete(deleteCharacter);

module.exports = router;

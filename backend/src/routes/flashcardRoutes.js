const express = require('express');
const { reviewFlashcard } = require('../controllers/flashcardController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.put('/:id/review', reviewFlashcard);

module.exports = router;

const express = require('express');
const { submitQuizAttempt } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/:id/submit', submitQuizAttempt);

module.exports = router;

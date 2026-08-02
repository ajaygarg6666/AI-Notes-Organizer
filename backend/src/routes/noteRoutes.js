const express = require('express');
const {
  uploadNote, getNotes, getNoteById, toggleBookmark, deleteNote, getDashboardSummary,
} = require('../controllers/noteController');
const { generateFlashcards, getFlashcards } = require('../controllers/flashcardController');
const { generateQuiz, getQuizzesForNote } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();
router.use(protect);

router.get('/dashboard/summary', getDashboardSummary);

router.post('/', upload.single('file'), uploadNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id/bookmark', toggleBookmark);
router.delete('/:id', deleteNote);

router.post('/:noteId/flashcards/generate', generateFlashcards);
router.get('/:noteId/flashcards', getFlashcards);

router.post('/:noteId/quiz/generate', generateQuiz);
router.get('/:noteId/quiz', getQuizzesForNote);

module.exports = router;

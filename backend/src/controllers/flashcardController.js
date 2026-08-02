const Flashcard = require('../models/Flashcard');
const Note = require('../models/Note');
const StudyLog = require('../models/StudyLog');
const asyncHandler = require('../utils/asyncHandler');
const pythonService = require('../services/pythonService');

// @route POST /api/notes/:noteId/flashcards/generate
const generateFlashcards = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.noteId, user: req.user._id });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  if (!note.cleanedText) {
    return res.status(400).json({ success: false, message: 'Note has not finished processing yet' });
  }

  const count = Number(req.body.count) || 10;
  const generated = await pythonService.generateFlashcards(note.cleanedText, count);

  const flashcards = await Flashcard.insertMany(
    generated.map((f) => ({ user: req.user._id, note: note._id, front: f.front, back: f.back }))
  );

  res.status(201).json({ success: true, data: flashcards });
});

// @route GET /api/notes/:noteId/flashcards
const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await Flashcard.find({ note: req.params.noteId, user: req.user._id });
  res.json({ success: true, data: flashcards });
});

// @route PUT /api/flashcards/:id/review
const reviewFlashcard = asyncHandler(async (req, res) => {
  const { wasCorrect } = req.body;
  const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!flashcard) return res.status(404).json({ success: false, message: 'Flashcard not found' });

  flashcard.timesReviewed += 1;
  if (wasCorrect) flashcard.timesCorrect += 1;
  flashcard.lastReviewedAt = new Date();
  await flashcard.save();

  await StudyLog.create({
    user: req.user._id,
    note: flashcard.note,
    activityType: 'flashcard_review',
  });

  res.json({ success: true, data: flashcard });
});

module.exports = { generateFlashcards, getFlashcards, reviewFlashcard };

const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    // simple spaced-repetition-ish tracking
    timesReviewed: { type: Number, default: 0 },
    timesCorrect: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);

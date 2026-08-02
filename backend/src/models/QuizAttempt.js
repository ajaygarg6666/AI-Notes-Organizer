const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true }, // percentage
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId },
        selectedAnswer: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);

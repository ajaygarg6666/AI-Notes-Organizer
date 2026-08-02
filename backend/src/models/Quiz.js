const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['mcq', 'true_false', 'fill_blank'], required: true },
    question: { type: String, required: true },
    options: [{ type: String }], // used for mcq
    correctAnswer: { type: String, required: true },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);

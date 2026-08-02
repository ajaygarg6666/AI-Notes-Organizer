const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Note = require('../models/Note');
const StudyLog = require('../models/StudyLog');
const asyncHandler = require('../utils/asyncHandler');
const pythonService = require('../services/pythonService');

// @route POST /api/notes/:noteId/quiz/generate
const generateQuiz = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.noteId, user: req.user._id });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  if (!note.cleanedText) {
    return res.status(400).json({ success: false, message: 'Note has not finished processing yet' });
  }

  const config = {
    mcqCount: req.body.mcqCount ?? 5,
    trueFalseCount: req.body.trueFalseCount ?? 3,
    fillBlankCount: req.body.fillBlankCount ?? 2,
  };

  const generated = await pythonService.generateQuiz(note.cleanedText, config);

  const quiz = await Quiz.create({
    user: req.user._id,
    note: note._id,
    title: `Quiz: ${note.title}`,
    questions: generated.questions,
  });

  res.status(201).json({ success: true, data: quiz });
});

// @route GET /api/notes/:noteId/quiz
const getQuizzesForNote = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ note: req.params.noteId, user: req.user._id });
  res.json({ success: true, data: quizzes });
});

// @route POST /api/quiz/:id/submit
const submitQuizAttempt = asyncHandler(async (req, res) => {
  const { answers = [] } = req.body; // [{ questionId, selectedAnswer }]
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  let correctAnswers = 0;
  const gradedAnswers = quiz.questions.map((q) => {
    const submitted = Array.isArray(answers) ? answers.find((a) => a.questionId === q._id.toString()) : null;
    const isCorrect = submitted && submitted.selectedAnswer === q.correctAnswer;
    if (isCorrect) correctAnswers += 1;
    return {
      question: q._id,
      selectedAnswer: submitted ? submitted.selectedAnswer : null,
      isCorrect: Boolean(isCorrect),
    };
  });

  const score = quiz.questions.length > 0 ? Math.round((correctAnswers / quiz.questions.length) * 100) : 0;

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    score,
    totalQuestions: quiz.questions.length,
    correctAnswers,
    answers: gradedAnswers,
  });

  await StudyLog.create({ user: req.user._id, note: quiz.note, activityType: 'quiz_attempt' });

  res.status(201).json({ success: true, data: attempt });
});

module.exports = { generateQuiz, getQuizzesForNote, submitQuizAttempt };

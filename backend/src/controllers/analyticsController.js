const StudyLog = require('../models/StudyLog');
const QuizAttempt = require('../models/QuizAttempt');
const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');

// @route GET /api/analytics/overview
const getOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [studyTimeAgg, notesReadCount, quizAttempts] = await Promise.all([
    StudyLog.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$activityType', totalSeconds: { $sum: '$durationSeconds' }, count: { $sum: 1 } } },
    ]),
    StudyLog.countDocuments({ user: userId, activityType: 'note_view' }),
    QuizAttempt.find({ user: userId }).populate({ path: 'quiz', select: 'title note' }),
  ]);

  const avgQuizScore = quizAttempts.length
    ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
    : 0;

  res.json({
    success: true,
    data: {
      studyTimeByActivity: studyTimeAgg,
      notesReadCount,
      avgQuizScore,
      quizAttemptCount: quizAttempts.length,
      recentQuizScores: quizAttempts.slice(-10).map((a) => ({
        quizTitle: a.quiz?.title,
        score: a.score,
        date: a.createdAt,
      })),
    },
  });
});

// @route GET /api/analytics/weak-topics
// Flags subjects/notes where quiz performance is consistently low.
const getWeakTopics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const attempts = await QuizAttempt.find({ user: userId }).populate({
    path: 'quiz',
    populate: { path: 'note', select: 'title subject', populate: { path: 'subject', select: 'name' } },
  });

  const bySubject = {};
  attempts.forEach((a) => {
    const subjectName = a.quiz?.note?.subject?.name || 'Unknown';
    if (!bySubject[subjectName]) bySubject[subjectName] = { totalScore: 0, count: 0 };
    bySubject[subjectName].totalScore += a.score;
    bySubject[subjectName].count += 1;
  });

  const weakTopics = Object.entries(bySubject)
    .map(([subject, { totalScore, count }]) => ({
      subject,
      averageScore: Math.round(totalScore / count),
      attempts: count,
    }))
    .filter((t) => t.averageScore < 60)
    .sort((a, b) => a.averageScore - b.averageScore);

  res.json({ success: true, data: weakTopics });
});

module.exports = { getOverview, getWeakTopics };

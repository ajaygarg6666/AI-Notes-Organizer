const mongoose = require('mongoose');

// Tracks study sessions for analytics (study time, notes read, weak topics)
const studyLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    activityType: {
      type: String,
      enum: ['note_view', 'flashcard_review', 'quiz_attempt'],
      required: true,
    },
    durationSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyLog', studyLogSchema);

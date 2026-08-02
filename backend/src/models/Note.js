const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true, trim: true },
    originalFileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // local path or cloud URL
    fileType: { type: String, enum: ['pdf', 'docx', 'pptx', 'txt', 'image'], required: true },

    // Populated by the Python AI service after processing
    rawText: { type: String, default: '' },
    cleanedText: { type: String, default: '' },
    summaryShort: { type: String, default: '' },
    summaryMedium: { type: String, default: '' },
    summaryDetailed: { type: String, default: '' },
    keywords: [{ type: String }],
    embedding: { type: [Number], default: [], select: false }, // vector for semantic search

    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    processingError: { type: String, default: '' },

    isBookmarked: { type: Boolean, default: false },
    lastViewedAt: { type: Date },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

noteSchema.index({ title: 'text', cleanedText: 'text', keywords: 'text' });

module.exports = mongoose.model('Note', noteSchema);

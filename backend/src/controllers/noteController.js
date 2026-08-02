const path = require('path');
const Note = require('../models/Note');
const StudyLog = require('../models/StudyLog');
const asyncHandler = require('../utils/asyncHandler');
const pythonService = require('../services/pythonService');

const extToFileType = (ext) => {
  const map = {
    '.pdf': 'pdf',
    '.docx': 'docx',
    '.pptx': 'pptx',
    '.txt': 'txt',
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
  };
  return map[ext.toLowerCase()] || 'txt';
};

// @route POST /api/notes  (multipart/form-data, field name: "file")
const uploadNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const { title, subject } = req.body;
  const ext = path.extname(req.file.originalname);

  const note = await Note.create({
    user: req.user._id,
    subject,
    title: title || req.file.originalname,
    originalFileName: req.file.originalname,
    fileUrl: req.file.path, // swap for Cloudinary/S3 URL if using cloud storage
    fileType: extToFileType(ext),
    processingStatus: 'pending',
  });

  // Kick off AI processing asynchronously — don't block the upload response.
  // In production, swap this for a proper job queue (BullMQ, RQ, Celery).
  processNoteAsync(note);

  res.status(201).json({ success: true, data: note });
});

const processNoteAsync = async (note) => {
  try {
    note.processingStatus = 'processing';
    await note.save();

    const result = await pythonService.processDocument({
      filePath: path.resolve(note.fileUrl),
      fileType: note.fileType,
      noteId: note._id.toString(),
    });

    note.rawText = result.rawText || '';
    note.cleanedText = result.cleanedText || '';
    note.summaryShort = result.summaryShort || '';
    note.summaryMedium = result.summaryMedium || '';
    note.summaryDetailed = result.summaryDetailed || '';
    note.keywords = result.keywords || [];
    note.embedding = result.embedding || [];
    note.processingStatus = 'completed';
    await note.save();
  } catch (err) {
    note.processingStatus = 'failed';
    note.processingError = err.message;
    await note.save();
  }
};

// @route GET /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.subject) filter.subject = req.query.subject;
  if (req.query.bookmarked === 'true') filter.isBookmarked = true;

  const notes = await Note.find(filter).sort({ createdAt: -1 }).populate('subject', 'name color');
  res.json({ success: true, data: notes });
});

// @route GET /api/notes/:id
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id }).populate('subject', 'name color');
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  note.lastViewedAt = new Date();
  note.viewCount += 1;
  await note.save();

  await StudyLog.create({ user: req.user._id, note: note._id, subject: note.subject, activityType: 'note_view' });

  res.json({ success: true, data: note });
});

// @route PUT /api/notes/:id/bookmark
const toggleBookmark = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
  note.isBookmarked = !note.isBookmarked;
  await note.save();
  res.json({ success: true, data: note });
});

// @route DELETE /api/notes/:id
const deleteNote = asyncHandler(async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Note deleted' });
});

// @route GET /api/notes/dashboard/summary
const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [totalNotes, recentlyViewed, uploadHistory] = await Promise.all([
    Note.countDocuments({ user: userId }),
    Note.find({ user: userId, lastViewedAt: { $exists: true } })
      .sort({ lastViewedAt: -1 })
      .limit(5)
      .select('title lastViewedAt subject'),
    Note.find({ user: userId }).sort({ createdAt: -1 }).limit(10).select('title createdAt processingStatus'),
  ]);

  res.json({
    success: true,
    data: { totalNotes, recentlyViewed, uploadHistory },
  });
});

module.exports = {
  uploadNote,
  getNotes,
  getNoteById,
  toggleBookmark,
  deleteNote,
  getDashboardSummary,
};

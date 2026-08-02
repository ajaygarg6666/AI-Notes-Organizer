const Folder = require('../models/Folder');
const Subject = require('../models/Subject');
const asyncHandler = require('../utils/asyncHandler');

// ---- Folders (semester-wise) ----

const createFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const folder = await Folder.create({ user: req.user._id, name });
  res.status(201).json({ success: true, data: folder });
});

const getFolders = asyncHandler(async (req, res) => {
  const folders = await Folder.find({ user: req.user._id }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: folders });
});

const deleteFolder = asyncHandler(async (req, res) => {
  await Folder.deleteOne({ _id: req.params.id, user: req.user._id });
  await Subject.deleteMany({ folder: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Folder and its subjects deleted' });
});

// ---- Subjects ----

const createSubject = asyncHandler(async (req, res) => {
  const { name, folder, color } = req.body;
  const subject = await Subject.create({ user: req.user._id, folder, name, color });
  res.status(201).json({ success: true, data: subject });
});

const getSubjects = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.folder) filter.folder = req.query.folder;
  const subjects = await Subject.find(filter).sort({ createdAt: 1 });
  res.json({ success: true, data: subjects });
});

const updateSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json({ success: true, data: subject });
});

const deleteSubject = asyncHandler(async (req, res) => {
  await Subject.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ success: true, message: 'Subject deleted' });
});

module.exports = {
  createFolder,
  getFolders,
  deleteFolder,
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
};

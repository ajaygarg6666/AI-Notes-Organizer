const mongoose = require('mongoose');

// Semester-wise folder, e.g. "Semester 3"
const folderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true }, // e.g. "Semester 3"
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

folderSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Folder', folderSchema);

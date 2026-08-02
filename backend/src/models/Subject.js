const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', required: true },
    name: { type: String, required: true, trim: true }, // e.g. "Operating Systems"
    color: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subject', subjectSchema);

import React from 'react';
import { Link } from 'react-router-dom';

const statusColors = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

const NoteCard = ({ note }) => (
  <Link
    to={`/notes/${note._id}`}
    className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-surface-dark"
  >
    <div className="flex items-start justify-between">
      <h3 className="font-display font-semibold text-ink dark:text-gray-100">{note.title}</h3>
      {note.isBookmarked && <span title="Bookmarked">⭐</span>}
    </div>
    <p className="mt-1 text-sm text-gray-500">{note.subject?.name}</p>
    <span
      className={`mt-3 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        statusColors[note.processingStatus] || statusColors.pending
      }`}
    >
      {note.processingStatus}
    </span>
  </Link>
);

export default NoteCard;

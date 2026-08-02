import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const NoteUpload = () => {
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/subjects').then(({ data }) => setSubjects(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !subject) {
      setError('Please choose a subject and a file');
      return;
    }
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title || file.name);
    formData.append('subject', subject);

    try {
      const { data } = await api.post('/notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/notes/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Upload a Note</h1>
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-surface-dark">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title (optional)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">File</label>
        <input
          type="file"
          accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6 w-full text-sm"
        />

        <button
          disabled={uploading}
          className="w-full rounded-lg bg-primary-600 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </button>
      </form>
    </div>
  );
};

export default NoteUpload;

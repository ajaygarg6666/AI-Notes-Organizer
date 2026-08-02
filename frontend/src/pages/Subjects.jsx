import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Subjects = () => {
  const [folders, setFolders] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newFolder, setNewFolder] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');

  const loadData = async () => {
    const [foldersRes, subjectsRes] = await Promise.all([
      api.get('/subjects/folders'),
      api.get('/subjects'),
    ]);
    setFolders(foldersRes.data.data);
    setSubjects(subjectsRes.data.data);
    if (!selectedFolder && foldersRes.data.data.length) {
      setSelectedFolder(foldersRes.data.data[0]._id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createFolder = async (e) => {
    e.preventDefault();
    if (!newFolder.trim()) return;
    await api.post('/subjects/folders', { name: newFolder });
    setNewFolder('');
    loadData();
  };

  const createSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !selectedFolder) return;
    await api.post('/subjects', { name: newSubject, folder: selectedFolder });
    setNewSubject('');
    loadData();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Semesters & Subjects</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Semester Folders</h2>
          <form onSubmit={createFolder} className="mb-4 flex gap-2">
            <input
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              placeholder="e.g. Semester 3"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
            />
            <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {folders.map((f) => (
              <li
                key={f._id}
                onClick={() => setSelectedFolder(f._id)}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                  selectedFolder === f._id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-700/20'
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                {f.name}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Subjects</h2>
          <form onSubmit={createSubject} className="mb-4 flex gap-2">
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              disabled={!selectedFolder}
            />
            <button
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              disabled={!selectedFolder}
            >
              Add
            </button>
          </form>
          <ul className="space-y-2">
            {subjects
              .filter((s) => s.folder === selectedFolder)
              .map((s) => (
                <li key={s._id} className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800">
                  {s.name}
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Subjects;

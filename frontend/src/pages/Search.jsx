import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.get('/search', { params: { q: query } });
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Smart Search</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by meaning, not just filename..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        <button className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          Search
        </button>
      </form>

      {loading && <p className="text-sm text-gray-400">Searching...</p>}

      {results && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-3 font-display text-lg font-semibold">Keyword Matches</h2>
            <ul className="space-y-2">
              {results.keywordMatches.map((n) => (
                <li key={n._id}>
                  <Link to={`/notes/${n._id}`} className="text-sm text-primary-600 hover:underline">
                    {n.title}
                  </Link>
                  <p className="text-xs text-gray-500">{n.summaryShort}</p>
                </li>
              ))}
              {results.keywordMatches.length === 0 && <p className="text-sm text-gray-400">No keyword matches.</p>}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-lg font-semibold">Semantic Matches</h2>
            <ul className="space-y-2">
              {results.semanticMatches.map((m) => (
                <li key={m.noteId}>
                  <Link to={`/notes/${m.noteId}`} className="text-sm text-primary-600 hover:underline">
                    {m.title}
                  </Link>
                  <p className="text-xs text-gray-500">Relevance: {(m.score * 100).toFixed(0)}%</p>
                </li>
              ))}
              {results.semanticMatches.length === 0 && (
                <p className="text-sm text-gray-400">No semantic matches (or the AI service is offline).</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};

export default Search;

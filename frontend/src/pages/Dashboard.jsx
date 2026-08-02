import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold text-ink dark:text-gray-100">{value}</p>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/notes/dashboard/summary').then(({ data }) => setSummary(data.data));
  }, []);

  if (!summary) return <p className="text-gray-400">Loading dashboard...</p>;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Notes" value={summary.totalNotes} />
        <StatCard label="Recently Viewed" value={summary.recentlyViewed.length} />
        <StatCard label="Uploads" value={summary.uploadHistory.length} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink dark:text-gray-100">Recently Viewed</h2>
          <ul className="space-y-2">
            {summary.recentlyViewed.map((n) => (
              <li key={n._id}>
                <Link to={`/notes/${n._id}`} className="text-sm text-primary-600 hover:underline">
                  {n.title}
                </Link>
              </li>
            ))}
            {summary.recentlyViewed.length === 0 && <p className="text-sm text-gray-400">No notes viewed yet.</p>}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink dark:text-gray-100">Upload History</h2>
          <ul className="space-y-2">
            {summary.uploadHistory.map((n) => (
              <li key={n._id} className="flex items-center justify-between text-sm">
                <span>{n.title}</span>
                <span className="text-xs text-gray-400">{n.processingStatus}</span>
              </li>
            ))}
            {summary.uploadHistory.length === 0 && <p className="text-sm text-gray-400">No uploads yet.</p>}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

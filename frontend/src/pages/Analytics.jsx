import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    api.get('/analytics/overview').then(({ data }) => setOverview(data.data));
    api.get('/analytics/weak-topics').then(({ data }) => setWeakTopics(data.data));
  }, []);

  if (!overview) return <p className="text-gray-400">Loading analytics...</p>;

  const chartData = {
    labels: overview.recentQuizScores.map((_, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: 'Quiz Score (%)',
        data: overview.recentQuizScores.map((q) => q.score),
        backgroundColor: '#4F4CDE',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink dark:text-gray-100">Study Analytics</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
          <p className="text-sm text-gray-500">Notes Read</p>
          <p className="mt-1 font-display text-2xl font-semibold">{overview.notesReadCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
          <p className="text-sm text-gray-500">Quiz Attempts</p>
          <p className="mt-1 font-display text-2xl font-semibold">{overview.quizAttemptCount}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
          <p className="text-sm text-gray-500">Avg Quiz Score</p>
          <p className="mt-1 font-display text-2xl font-semibold">{overview.avgQuizScore}%</p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
        <h2 className="mb-4 font-display text-lg font-semibold">Recent Quiz Scores</h2>
        {overview.recentQuizScores.length > 0 ? (
          <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        ) : (
          <p className="text-sm text-gray-400">No quiz attempts yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-dark">
        <h2 className="mb-4 font-display text-lg font-semibold">Weak Topics</h2>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-gray-400">No weak topics detected yet — keep taking quizzes!</p>
        ) : (
          <ul className="space-y-2">
            {weakTopics.map((t) => (
              <li key={t.subject} className="flex items-center justify-between text-sm">
                <span>{t.subject}</span>
                <span className="font-medium text-red-600">{t.averageScore}% avg</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Analytics;

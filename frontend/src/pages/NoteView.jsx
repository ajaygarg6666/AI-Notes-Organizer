import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TABS = ['Summary', 'Keywords', 'Flashcards', 'Quiz'];

const NoteView = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [tab, setTab] = useState('Summary');
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [flippedId, setFlippedId] = useState(null);

  const loadNote = async () => {
    const { data } = await api.get(`/notes/${id}`);
    setNote(data.data);
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  const toggleBookmark = async () => {
    const { data } = await api.put(`/notes/${id}/bookmark`);
    setNote(data.data);
  };

  const generateFlashcards = async () => {
    const { data } = await api.post(`/notes/${id}/flashcards/generate`, { count: 10 });
    setFlashcards(data.data);
    setTab('Flashcards');
  };

  const generateQuiz = async () => {
    const { data } = await api.post(`/notes/${id}/quiz/generate`, {});
    setQuiz(data.data);
    setTab('Quiz');
  };

  if (!note) return <p className="text-gray-400">Loading note...</p>;

  const summaryText =
    summaryLength === 'short' ? note.summaryShort : summaryLength === 'detailed' ? note.summaryDetailed : note.summaryMedium;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink dark:text-gray-100">{note.title}</h1>
        <button onClick={toggleBookmark} className="text-2xl" title="Toggle bookmark">
          {note.isBookmarked ? '⭐' : '☆'}
        </button>
      </div>

      <span className="mb-6 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800">
        Status: {note.processingStatus}
      </span>

      {note.processingStatus === 'pending' || note.processingStatus === 'processing' ? (
        <p className="text-sm text-gray-500">
          Your note is still being processed by the AI pipeline. This page will update once it's ready — refresh in a bit.
        </p>
      ) : note.processingStatus === 'failed' ? (
        <p className="text-sm text-red-600">Processing failed: {note.processingError}</p>
      ) : (
        <>
          <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-800">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-2 text-sm font-medium ${
                  tab === t ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Summary' && (
            <div>
              <div className="mb-3 flex gap-2">
                {['short', 'medium', 'detailed'].map((len) => (
                  <button
                    key={len}
                    onClick={() => setSummaryLength(len)}
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      summaryLength === len ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">{summaryText}</p>
            </div>
          )}

          {tab === 'Keywords' && (
            <div className="flex flex-wrap gap-2">
              {note.keywords?.map((k) => (
                <span key={k} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-700/20 dark:text-primary-400">
                  {k}
                </span>
              ))}
            </div>
          )}

          {tab === 'Flashcards' && (
            <div>
              {flashcards.length === 0 ? (
                <button onClick={generateFlashcards} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                  Generate Flashcards
                </button>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {flashcards.map((f) => (
                    <div
                      key={f._id}
                      onClick={() => setFlippedId(flippedId === f._id ? null : f._id)}
                      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm dark:border-gray-800 dark:bg-surface-dark"
                    >
                      <p className="mb-1 text-xs font-medium text-gray-400">{flippedId === f._id ? 'BACK' : 'FRONT'}</p>
                      <p>{flippedId === f._id ? f.back : f.front}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'Quiz' && (
            <div>
              {!quiz ? (
                <button onClick={generateQuiz} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                  Generate Quiz
                </button>
              ) : (
                <QuizRunner quiz={quiz} />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const QuizRunner = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const submit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })),
    };
    const { data } = await api.post(`/quiz/${quiz._id}/submit`, payload);
    setResult(data.data);
  };

  if (result) {
    return (
      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <p className="font-display text-lg font-semibold">Score: {result.score}%</p>
        <p className="text-sm text-gray-500">{result.correctAnswers} / {result.totalQuestions} correct</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {quiz.questions.map((q) => (
        <div key={q._id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <p className="mb-2 text-sm font-medium">{q.question}</p>
          {q.type === 'fill_blank' ? (
            <input
              onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
              placeholder="Your answer"
            />
          ) : (
            <div className="flex flex-col gap-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={submit} className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
        Submit Quiz
      </button>
    </div>
  );
};

export default NoteView;

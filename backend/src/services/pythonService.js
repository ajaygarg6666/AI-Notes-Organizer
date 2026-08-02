const axios = require('axios');

const PYTHON_BASE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: PYTHON_BASE_URL,
  timeout: 120000, // NLP calls can be slow
});

// Sends a file path to the Python AI service to run the full pipeline:
// extract -> clean -> summarize -> keywords -> flashcards -> quiz -> embedding
const processDocument = async ({ filePath, fileType, noteId }) => {
  const { data } = await client.post('/process', { filePath, fileType, noteId });
  return data;
};

const getEmbedding = async (text) => {
  const { data } = await client.post('/embed', { text });
  return data.embedding;
};

const semanticSearch = async (query, noteEmbeddings) => {
  const { data } = await client.post('/search', { query, noteEmbeddings });
  return data.results;
};

const generateSummary = async (text, length = 'medium') => {
  const { data } = await client.post('/summarize', { text, length });
  return data.summary;
};

const generateFlashcards = async (text, count = 10) => {
  const { data } = await client.post('/flashcards', { text, count });
  return data.flashcards;
};

const generateQuiz = async (text, config = {}) => {
  const { data } = await client.post('/quiz', { text, config });
  return data.quiz;
};

module.exports = {
  processDocument,
  getEmbedding,
  semanticSearch,
  generateSummary,
  generateFlashcards,
  generateQuiz,
};

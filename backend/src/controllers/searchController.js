const Note = require('../models/Note');
const asyncHandler = require('../utils/asyncHandler');
const pythonService = require('../services/pythonService');

// @route GET /api/search?q=...
// Combines MongoDB text search (fast, keyword-based) with the Python
// service's semantic/embedding search (meaning-based) and merges results.
const search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
  }

  const userNotes = await Note.find({ user: req.user._id })
    .select('title cleanedText keywords subject fileUrl +embedding')
    .populate('subject', 'name');

  // Keyword pass (fast filter to shrink the candidate set)
  const keywordMatches = await Note.find(
    { user: req.user._id, $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .select('title subject fileUrl summaryShort')
    .populate('subject', 'name');

  // Semantic pass via the Python service, scoped to this user's notes
  let semanticMatches = [];
  try {
    const noteEmbeddings = {};
    userNotes.forEach((n) => {
      if (n.embedding && n.embedding.length > 0) {
        noteEmbeddings[n._id.toString()] = n.embedding;
      }
    });

    const results = await pythonService.semanticSearch(q, noteEmbeddings);
    semanticMatches = results.map((match) => {
      const note = userNotes.find((n) => n._id.toString() === match.noteId);
      return {
        ...match,
        title: note ? note.title : `Note ${match.noteId}`,
      };
    });
  } catch (err) {
    // Semantic search is a nice-to-have; fall back to keyword-only results if it fails
    console.error('Semantic search unavailable:', err.message);
  }

  res.json({
    success: true,
    data: {
      keywordMatches,
      semanticMatches, // [{ noteId, score, highlightedSnippet }]
    },
  });
});

module.exports = { search };

"""
Minimal in-process vector store used for the /search endpoint.

For this starter, embeddings are re-fetched from MongoDB per request
(passed in via candidateNoteIds is a placeholder — wire this up to your
Mongo connection to pull each note's stored `embedding` field). For real
scale, swap this for FAISS, Annoy, Qdrant, or MongoDB Atlas Vector Search.
"""
from app.services.embeddings import embed_text, cosine_similarity


def rank_by_similarity(query: str, note_embeddings: dict, top_k: int = 10):
    """
    note_embeddings: { noteId: [floats] }
    Returns: [{ noteId, score }] sorted by descending similarity
    """
    query_vector = embed_text(query)
    if not query_vector:
        return []

    scored = []
    for note_id, vector in note_embeddings.items():
        if not vector:
            continue
        score = cosine_similarity(query_vector, vector)
        scored.append({"noteId": note_id, "score": round(score, 4)})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]

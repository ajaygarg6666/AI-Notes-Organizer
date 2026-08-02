"""
Wraps sentence-transformers for generating dense vector embeddings, used for
semantic (meaning-based) search rather than plain keyword matching.
"""
from sentence_transformers import SentenceTransformer
import numpy as np
from app.config import EMBEDDING_MODEL

_model = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(EMBEDDING_MODEL)
    return _model


def embed_text(text: str) -> list:
    if not text or not text.strip():
        return []
    model = get_model()
    vector = model.encode(text, normalize_embeddings=True)
    return vector.tolist()


def cosine_similarity(vec_a: list, vec_b: list) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    if a.size == 0 or b.size == 0:
        return 0.0
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

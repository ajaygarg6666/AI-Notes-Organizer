"""
Extracts top keywords/topics from note text using spaCy for noun-phrase /
named-entity detection, ranked by TF-IDF relevance.
"""
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer

# Load once at import time. Run: python -m spacy download en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None


def extract_keywords(text: str, top_n: int = 10) -> list:
    if not text or not text.strip():
        return []

    candidates = set()

    if nlp:
        doc = nlp(text[:100000])  # cap length for performance
        for chunk in doc.noun_chunks:
            cleaned = chunk.text.strip().lower()
            if 2 <= len(cleaned) <= 40 and not cleaned.isdigit():
                candidates.add(cleaned)
        for ent in doc.ents:
            candidates.add(ent.text.strip().lower())
    else:
        # Fallback: naive word extraction if spaCy model isn't installed
        candidates.update(w.lower() for w in text.split() if len(w) > 4)

    if not candidates:
        return []

    candidates = list(candidates)
    try:
        vectorizer = TfidfVectorizer(stop_words="english", max_features=200)
        tfidf_matrix = vectorizer.fit_transform([text])
        scores = dict(zip(vectorizer.get_feature_names_out(), tfidf_matrix.toarray()[0]))
    except ValueError:
        return candidates[:top_n]

    def score_of(phrase: str) -> float:
        words = phrase.split()
        return sum(scores.get(w, 0) for w in words)

    ranked = sorted(candidates, key=score_of, reverse=True)
    return ranked[:top_n]

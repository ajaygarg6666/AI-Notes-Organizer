"""
Generates short / medium / detailed summaries.

This uses a simple extractive TF-IDF sentence-ranking approach so the service
runs without needing a hosted LLM. Swap `_rank_sentences` for a call to an
LLM (e.g. Claude via the Anthropic API) for higher-quality abstractive
summaries if you have API access.
"""
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

LENGTH_TO_SENTENCE_COUNT = {
    "short": 3,
    "medium": 7,
    "detailed": 15,
}


def _split_sentences(text: str):
    # Lightweight sentence splitter (avoids requiring nltk punkt download at build time)
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in sentences if len(s.strip()) > 15]


def _rank_sentences(sentences):
    if len(sentences) <= 1:
        return sentences

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(sentences)

    # Score each sentence by the sum of its TF-IDF weights (proxy for "informativeness")
    scores = np.asarray(tfidf_matrix.sum(axis=1)).flatten()
    ranked_indices = np.argsort(-scores)
    return ranked_indices


def summarize(text: str, length: str = "medium") -> str:
    sentences = _split_sentences(text)
    if not sentences:
        return ""

    target_count = LENGTH_TO_SENTENCE_COUNT.get(length, 7)
    target_count = min(target_count, len(sentences))

    ranked_indices = _rank_sentences(sentences)
    top_indices = sorted(ranked_indices[:target_count])  # restore original order

    return " ".join(sentences[i] for i in top_indices)


def summarize_all_lengths(text: str) -> dict:
    return {
        "summaryShort": summarize(text, "short"),
        "summaryMedium": summarize(text, "medium"),
        "summaryDetailed": summarize(text, "detailed"),
    }

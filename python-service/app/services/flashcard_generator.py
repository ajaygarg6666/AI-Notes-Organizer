"""
Generates Q/A flashcards from note text.

This starter uses a rule-based approach: it finds definitional sentences
("X is/are/refers to ...") and keyword-anchored sentences, then turns them
into front/back pairs. For higher-quality cards, replace `_build_card` with
a call to an LLM (e.g. Claude) prompted to produce front/back JSON.
"""
import re
from app.services.keyword_extractor import extract_keywords


def _split_sentences(text: str):
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in sentences if len(s.strip()) > 20]


DEFINITION_PATTERN = re.compile(
    r"^(.{2,60}?)\s+(is|are|refers to|means|can be defined as)\s+(.+)$",
    re.IGNORECASE,
)


def generate_flashcards(text: str, count: int = 10) -> list:
    sentences = _split_sentences(text)
    keywords = extract_keywords(text, top_n=count * 2)

    cards = []

    # 1. Definitional sentences -> direct front/back
    for sentence in sentences:
        match = DEFINITION_PATTERN.match(sentence)
        if match:
            term, verb, definition = match.groups()
            term = term.strip().rstrip(",")
            if len(term.split()) <= 6:  # keep the "front" concise
                cards.append({"front": f"What {verb} {term}?", "back": sentence})
        if len(cards) >= count:
            break

    # 2. Fall back to keyword-anchored sentences if not enough definitional cards
    if len(cards) < count:
        used_sentences = {c["back"] for c in cards}
        for keyword in keywords:
            if len(cards) >= count:
                break
            for sentence in sentences:
                if keyword in sentence.lower() and sentence not in used_sentences:
                    cards.append({"front": f"Explain: {keyword}", "back": sentence})
                    used_sentences.add(sentence)
                    break

    return cards[:count]

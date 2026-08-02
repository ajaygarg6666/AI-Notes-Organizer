"""
Generates MCQ, True/False, and Fill-in-the-blank questions from note text.

Rule-based starter implementation:
- MCQs: built from keyword-anchored sentences, with distractors sampled from
  other extracted keywords.
- True/False: built from real sentences (always "True") plus negated/altered
  versions (always "False").
- Fill in the blank: a keyword is blanked out of a sentence containing it.

Swap these generators for LLM-based ones (e.g. Claude) for higher-quality,
more varied questions.
"""
import random
import re
from app.services.keyword_extractor import extract_keywords


def _split_sentences(text: str):
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    return [s.strip() for s in sentences if len(s.strip()) > 20]


def _generate_mcqs(sentences, keywords, count):
    questions = []
    used = set()
    for keyword in keywords:
        if len(questions) >= count:
            break
        for sentence in sentences:
            if keyword in sentence.lower() and sentence not in used:
                distractors = [k for k in keywords if k != keyword]
                random.shuffle(distractors)
                options = [keyword] + distractors[:3]
                random.shuffle(options)
                if len(options) < 2:
                    continue
                questions.append({
                    "type": "mcq",
                    "question": f"Which term best relates to: \"{sentence}\"?",
                    "options": options,
                    "correctAnswer": keyword,
                })
                used.add(sentence)
                break
    return questions


def _generate_true_false(sentences, count):
    questions = []
    random.shuffle(sentences)
    for i, sentence in enumerate(sentences[: count * 2]):
        if len(questions) >= count:
            break
        make_false = i % 2 == 1
        if make_false:
            # crude negation for variety; for production swap to LLM-based negation
            statement = re.sub(r"\bis\b", "is not", sentence, count=1)
            if statement == sentence:
                statement = "It is NOT true that: " + sentence
            answer = "False"
        else:
            statement = sentence
            answer = "True"
        questions.append({
            "type": "true_false",
            "question": statement,
            "options": ["True", "False"],
            "correctAnswer": answer,
        })
    return questions


def _generate_fill_blank(sentences, keywords, count):
    questions = []
    used = set()
    for keyword in keywords:
        if len(questions) >= count:
            break
        for sentence in sentences:
            if keyword in sentence.lower() and sentence not in used:
                pattern = re.compile(re.escape(keyword), re.IGNORECASE)
                blanked = pattern.sub("_____", sentence, count=1)
                if "_____" in blanked:
                    questions.append({
                        "type": "fill_blank",
                        "question": blanked,
                        "options": [],
                        "correctAnswer": keyword,
                    })
                    used.add(sentence)
                    break
    return questions


def generate_quiz(text: str, mcq_count=5, true_false_count=3, fill_blank_count=2) -> dict:
    sentences = _split_sentences(text)
    keywords = extract_keywords(text, top_n=max(15, mcq_count + fill_blank_count + 5))

    questions = []
    questions += _generate_mcqs(sentences, keywords, mcq_count)
    questions += _generate_true_false(sentences, true_false_count)
    questions += _generate_fill_blank(sentences, keywords, fill_blank_count)

    return {"questions": questions}

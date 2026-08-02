"""
Cleans raw extracted text: removes excess whitespace, page-number artifacts,
non-printable characters, and normalizes line breaks before it's used
downstream for summarization / embeddings / keyword extraction.
"""
import re


def clean_text(raw_text: str) -> str:
    if not raw_text:
        return ""

    text = raw_text.replace("\x00", " ")

    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Collapse repeated whitespace/tabs within a line
    text = re.sub(r"[ \t]{2,}", " ", text)

    # Drop lines that are just page numbers e.g. "12" or "Page 12"
    lines = text.split("\n")
    cleaned_lines = [
        line for line in lines
        if not re.fullmatch(r"\s*(page\s*)?\d{1,4}\s*", line.strip(), flags=re.IGNORECASE)
    ]
    text = "\n".join(cleaned_lines)

    return text.strip()

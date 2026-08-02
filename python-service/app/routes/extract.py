from fastapi import APIRouter, HTTPException
from app.models.schemas import ProcessDocumentRequest, ProcessDocumentResponse
from app.services.pdf_extractor import extract_text
from app.services.text_cleaner import clean_text
from app.services.summarizer import summarize_all_lengths
from app.services.keyword_extractor import extract_keywords
from app.services.embeddings import embed_text

router = APIRouter()


@router.post("/process", response_model=ProcessDocumentResponse)
def process_document(payload: ProcessDocumentRequest):
    """
    Full pipeline for a newly uploaded note:
    extract -> clean -> summarize (3 lengths) -> keywords -> embedding
    """
    try:
        raw_text = extract_text(payload.filePath, payload.fileType)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Text extraction failed: {e}")

    cleaned = clean_text(raw_text)

    if not cleaned:
        raise HTTPException(status_code=422, detail="No extractable text found in document")

    summaries = summarize_all_lengths(cleaned)
    keywords = extract_keywords(cleaned)
    embedding = embed_text(cleaned)

    return ProcessDocumentResponse(
        rawText=raw_text,
        cleanedText=cleaned,
        summaryShort=summaries["summaryShort"],
        summaryMedium=summaries["summaryMedium"],
        summaryDetailed=summaries["summaryDetailed"],
        keywords=keywords,
        embedding=embedding,
    )

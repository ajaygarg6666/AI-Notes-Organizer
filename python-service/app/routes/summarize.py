from fastapi import APIRouter
from app.models.schemas import SummarizeRequest, SummarizeResponse
from app.services.summarizer import summarize

router = APIRouter()


@router.post("/summarize", response_model=SummarizeResponse)
def summarize_text(payload: SummarizeRequest):
    result = summarize(payload.text, payload.length)
    return SummarizeResponse(summary=result)

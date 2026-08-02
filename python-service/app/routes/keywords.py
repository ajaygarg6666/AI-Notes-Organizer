from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.keyword_extractor import extract_keywords

router = APIRouter()


class KeywordsRequest(BaseModel):
    text: str
    topN: int = 10


class KeywordsResponse(BaseModel):
    keywords: List[str]


@router.post("/keywords", response_model=KeywordsResponse)
def get_keywords(payload: KeywordsRequest):
    return KeywordsResponse(keywords=extract_keywords(payload.text, payload.topN))

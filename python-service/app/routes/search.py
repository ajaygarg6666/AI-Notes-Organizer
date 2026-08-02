from fastapi import APIRouter
from app.models.schemas import EmbedRequest, EmbedResponse, SearchRequest, SearchResponse, SearchResultItem
from app.services.embeddings import embed_text
from app.services.vector_store import rank_by_similarity

router = APIRouter()


@router.post("/embed", response_model=EmbedResponse)
def embed(payload: EmbedRequest):
    return EmbedResponse(embedding=embed_text(payload.text))


@router.post("/search", response_model=SearchResponse)
def search(payload: SearchRequest):
    if not payload.noteEmbeddings:
        return SearchResponse(results=[])
    
    ranked = rank_by_similarity(payload.query, payload.noteEmbeddings)
    results = [
        SearchResultItem(noteId=item["noteId"], score=item["score"])
        for item in ranked
    ]
    return SearchResponse(results=results)

from fastapi import APIRouter
from app.models.schemas import FlashcardsRequest, FlashcardsResponse
from app.services.flashcard_generator import generate_flashcards

router = APIRouter()


@router.post("/flashcards", response_model=FlashcardsResponse)
def create_flashcards(payload: FlashcardsRequest):
    cards = generate_flashcards(payload.text, payload.count)
    return FlashcardsResponse(flashcards=cards)

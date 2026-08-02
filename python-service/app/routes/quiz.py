from fastapi import APIRouter
from app.models.schemas import QuizRequest, QuizResponse, QuizPayload
from app.services.quiz_generator import generate_quiz

router = APIRouter()


@router.post("/quiz", response_model=QuizResponse)
def create_quiz(payload: QuizRequest):
    result = generate_quiz(
        payload.text,
        mcq_count=payload.config.mcqCount,
        true_false_count=payload.config.trueFalseCount,
        fill_blank_count=payload.config.fillBlankCount,
    )
    return QuizResponse(quiz=QuizPayload(**result))

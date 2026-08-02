from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ProcessDocumentRequest(BaseModel):
    filePath: str
    fileType: str  # pdf | docx | pptx | txt | image
    noteId: str


class ProcessDocumentResponse(BaseModel):
    rawText: str
    cleanedText: str
    summaryShort: str
    summaryMedium: str
    summaryDetailed: str
    keywords: List[str]
    embedding: List[float]


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: List[float]


class SearchRequest(BaseModel):
    query: str
    candidateNoteIds: List[str] = []
    noteEmbeddings: Optional[Dict[str, List[float]]] = None


class SearchResultItem(BaseModel):
    noteId: str
    score: float
    highlightedSnippet: Optional[str] = None


class SearchResponse(BaseModel):
    results: List[SearchResultItem]


class SummarizeRequest(BaseModel):
    text: str
    length: str = "medium"  # short | medium | detailed


class SummarizeResponse(BaseModel):
    summary: str


class FlashcardsRequest(BaseModel):
    text: str
    count: int = 10


class FlashcardItem(BaseModel):
    front: str
    back: str


class FlashcardsResponse(BaseModel):
    flashcards: List[FlashcardItem]


class QuizConfig(BaseModel):
    mcqCount: int = 5
    trueFalseCount: int = 3
    fillBlankCount: int = 2


class QuizRequest(BaseModel):
    text: str
    config: QuizConfig = QuizConfig()


class QuizQuestion(BaseModel):
    type: str  # mcq | true_false | fill_blank
    question: str
    options: List[str] = []
    correctAnswer: str


class QuizPayload(BaseModel):
    questions: List[QuizQuestion]


class QuizResponse(BaseModel):
    quiz: QuizPayload

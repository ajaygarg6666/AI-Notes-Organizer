from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import extract, summarize, keywords, flashcards, quiz, search
from app.config import PORT

app = FastAPI(title="AI Notes Organizer - AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"success": True, "message": "AI service is running"}


app.include_router(extract.router)
app.include_router(summarize.router)
app.include_router(keywords.router)
app.include_router(flashcards.router)
app.include_router(quiz.router)
app.include_router(search.router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

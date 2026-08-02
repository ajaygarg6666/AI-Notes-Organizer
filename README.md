<div align="center">

  <h1>🧠 AI Notes Organizer</h1>
  
  <p>
    <b>A Google Drive + Notion AI + Quizlet hybrid built for modern students.</b><br />
    <i>Upload notes, extract text, generate AI summaries, flashcards, quizzes, and perform semantic search.</i>
  </p>

  <p>
    <a href="https://github.com/ajaygarg6666/ai-notes-organizer/stargazers">
      <img src="https://img.shields.io/github/stars/ajaygarg6666/ai-notes-organizer?style=for-the-badge&color=8A2BE2" alt="Stars" />
    </a>
    <a href="https://github.com/ajaygarg6666/ai-notes-organizer/network/members">
      <img src="https://img.shields.io/github/forks/ajaygarg6666/ai-notes-organizer?style=for-the-badge&color=4169E1" alt="Forks" />
    </a>
    <a href="https://github.com/ajaygarg6666/ai-notes-organizer/issues">
      <img src="https://img.shields.io/github/issues/ajaygarg6666/ai-notes-organizer?style=for-the-badge&color=FF6347" alt="Issues" />
    </a>
    <a href="https://github.com/ajaygarg6666/ai-notes-organizer/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" />
    </a>
  </p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-roadmap">Roadmap</a>
  </p>

</div>

---

## ✨ Key Features

- 📂 **Smart Organization:** Semester folders and subject-level grouping for clean document management.
- ⚡ **Multi-Format Ingestion:** Instant text extraction from PDFs, Word Documents, PowerPoint slides, Images, and Text files.
- 🤖 **Automated NLP Pipeline:**
  - 📝 **Adaptive Summaries:** Generates short, medium, and long summaries on demand.
  - 🃏 **Flashcard Generator:** Automatically extracts core definitions and key facts.
  - 🎯 **Quiz Maker:** Creates interactive multiple-choice quizzes to test subject knowledge.
- 🔍 **Semantic Search:** Vector-based search using `sentence-transformers` to find concepts across user notes.
- 📊 **Study Analytics:** Track study time, monitor quiz performance over time, and identify weak topics via dynamic charts.
- 🌙 **Modern UX:** Fully responsive dark-mode support and seamless flashcard flip interfaces.

---

## 🛠️ Tech Stack

<div align="center">

### **Frontend**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### **Backend**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

### **AI Microservice**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![spaCy](https://img.shields.io/badge/spaCy-09A3D5?style=for-the-badge&logo=spacy&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)

</div>

---

## 🏗️ Architecture

```text
+-------------------+        HTTP / REST        +-------------------+        HTTP        +-----------------------+
|                   | ------------------------> |                   | -----------------> |                       |
|  React Frontend   |                           |    Express API    |                    |  Python Microservice  |
|   (Vite + CSS)    | <------------------------ |  (Node / MongoDB) | <----------------- | (FastAPI + spaCy NLP) |
+-------------------+                           +-------------------+                    +-----------------------+

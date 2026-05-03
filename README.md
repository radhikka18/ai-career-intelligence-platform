# 🤖 AI Career Intelligence Platform

An AI-powered ATS Resume Analyzer that helps job seekers optimize their resumes to beat Applicant Tracking Systems.

## 🔗 Live Demo
- **Frontend:** https://ai-career-intelligence-platform-beige.vercel.app
- **Backend API:** https://ai-career-intelligence-platform-rzzm.onrender.com/docs

## ✨ Features
- 📄 PDF Resume Upload & Preview
- 🎯 ATS Score (TF-IDF Cosine Similarity)
- ✅ Matched Skills Detection
- ❌ Missing Keywords Highlight
- 📊 Section Breakdown (Skills, Experience, Education)
- 💡 AI Suggestions to improve resume

## 🛠️ Tech Stack
| Frontend | Backend |
|----------|---------|
| React + Vite | FastAPI (Python) |
| Vercel | Render |
| TailwindCSS | TF-IDF + Sklearn |

## 🚀 Run Locally
```bash
# Backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 👩‍💻 Author
Radhika — B.Tech CSE, GWCET Nagpur
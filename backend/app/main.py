from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Form
import pdfplumber
import io
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

print("MAIN FILE IS RUNNING")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text(file_bytes, filename=""):
    if filename.endswitch(".docx"):
        import docx
        doc = docx.Document(io.BYtesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.lower()
    else:
        with pdfplumber.open(io.BYtesIO(file_bytes)) as pdf :
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
            return text.lower()
        
        


def extract_skills(text):
    keywords = [
        "react", "node", "express", "sql", "mongodb",
        "machine learning", "deep learning", "docker",
        "kubernetes", "aws", "azure", "git", "github",
        "python", "javascript", "fastapi", "flask"
    ]
    skills = []
    for keyword in keywords:
        if keyword in text.lower():
            skills.append(keyword)
    return list(set(skills))


def get_ats_score(resume_text: str, jd_text: str) -> int:
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    return round(float(score) * 100)


def get_section_scores(resume_text: str, jd_text: str) -> dict:
    sections = {"skills": "", "experience": "", "education": ""}
    current = "skills"

    for line in resume_text.split('\n'):
        l = line.lower()
        if any(k in l for k in ["skill", "technical", "technology"]):
            current = "skills"
        elif any(k in l for k in ["experience", "work", "internship", "project"]):
            current = "experience"
        elif any(k in l for k in ["education", "degree", "university", "college"]):
            current = "education"
        sections[current] += line + "\n"

    scores = {}
    for section, content in sections.items():
        if content.strip():
            vectorizer = TfidfVectorizer()
            try:
                tfidf = vectorizer.fit_transform([content, jd_text])
                scores[section] = round(float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]) * 100)
            except:
                scores[section] = 0
        else:
            scores[section] = 0

    return scores


@app.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    job_desc: str = Form(...)
):
    try:
        content = await file.read()
        resume_text = extract_text(content, file.filename)
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_desc)

        matched = [s for s in job_skills if s in resume_skills]
        missing = [s for s in job_skills if s not in resume_skills]
        suggestions = [f"Add '{s}' to your resume" for s in missing]

        ats_score = get_ats_score(resume_text, job_desc)
        section_scores = get_section_scores(resume_text, job_desc)

        return {
            "ats_score": ats_score,
            "section_scores": section_scores,
            "matched_skills": matched,
            "missing_skills": missing,
            "suggestions": suggestions
        }

    except Exception as e:
        return {"error": str(e)}


@app.post("/login")
async def login(
    email: str = Form(...),
    password: str = Form(...)
):
    if email == "admin@gmail.com" and password == "1234":
        return {"message": "Login successful"}
    return {"error": "Invalid credentials"}


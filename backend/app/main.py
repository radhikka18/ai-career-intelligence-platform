from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Form
import pdfplumber
import spacy
import io
from sentence_transformers import SentenceTransformer, util

print("MAIN FILE IS RUNNING")

app = FastAPI()

nlp = spacy.load("en_core_web_sm")

st_model = None

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_text(file_bytes):
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
        return text.lower()


def extract_skills(text):
    doc = nlp(text.lower())
    keywords = [
        "react", "node", "express",
        "sql", "mongodb",
        "machine learning", "deep learning",
        "docker", "kubernetes",
        "aws", "azure",
        "git", "github", "python", "javascript"
    ]
    skills = []
    for token in doc:
        if token.text in keywords:
            skills.append(token.text)
    return list(set(skills))


def calculate_ats(resume_skills, job_skills):
    matched = [skill for skill in job_skills if skill in resume_skills]
    missing = [skill for skill in job_skills if skill not in resume_skills]
    suggestions = [f"Add '{skill}' to your resume" for skill in missing]
    return matched, missing, suggestions


def get_semantic_score(resume_text: str, jd_text: str) -> int:
    embeddings = st_model.encode([resume_text, jd_text], convert_to_tensor=True)
    score = util.cos_sim(embeddings[0], embeddings[1])
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
            emb = st_model.encode([content, jd_text], convert_to_tensor=True)
            scores[section] = round(float(util.cos_sim(emb[0], emb[1])) * 100)
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
        resume_text = extract_text(content)
        resume_skills = extract_skills(resume_text)
        job_skills = extract_skills(job_desc)
        matched, missing, suggestions = calculate_ats(resume_skills, job_skills)
        ats_score = get_semantic_score(resume_text, job_desc)
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

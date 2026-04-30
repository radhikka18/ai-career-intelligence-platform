from fastapi import FastAPI, UploadFile, File, Form
import shutil
import os 
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    
    ats_score = 78
    matched_skills = ["Python", "FastAPI"]
    missing_skills = ["Docker", "AWS"]
    
    return {
        "ats_score":ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }

app. add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR ="uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "AI Carrer Intelligence Platform Running"}

# Upload Resume
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR,"resume.pdf")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file,buffer)
        
        return {"message":"Resume uploaded successfully"}
    
 # Save Job  Description   
@app.post("/job-description")
async def save_job_description(job_description: str = Form(...)):
    with open ("job_description.json", "w") as f:
        json.dump({"job_description": job_description}, f)
        
        return {"message": "Job description saved"}
    
# Preview Resume (dummy for now)
@app.get("/resume-preview")
def resume_preview():
    file_path = os.path.join(UPLOAD_DIR, "resume.pdf")
    
    if not  os.path.exists(file_path):
        return {"error": "Resume not found"}
    
    return {"preview": "Resume preview will be here"}

# Match Resume + Job
@app.get("/match")
def match():
    try:
        with open("job_description.json","r") as f:
            
            data = json.load(f)
            
            job_text = data["job_description"]
            
            return {
                "resume_preview":"Sample resume text...",
                "job_description": job_text,
                "match_score":"75%"
            }
    except:
        return {"error":"Upload resume and description first "}

    
    
    






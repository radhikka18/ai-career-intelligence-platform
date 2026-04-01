from fastapi import FastAPI, UploadFile, File, Form
from parser import parse_resume
from ats import calculate_ats_score

app = FastAPI()

@app.post("/analyze") 
async def analyze(file: UploadFile = File(...), job_description: str = Form(...)):
    content = await file.read()
    resume_text = parse_resume(content)
    score = calculate_ats_score(resume_text,job_description)
    return {
        "ats_score":score,
        "resume_preview": resume_text[:500]
    }
from fastapi import FastAPI, File, UploadFile
import os
import shutil
import json
import PyPDF2

app = FastAPI()

# -------------
# SETUP FOLDERS
#-------------
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

#-------------
# 1. UPLOAD RESUME
#--------------
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, "resune.pdf")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file,buffer)

        return{"message": "resume uploaded successfully"}
    
    #---------------
    # 2. SAVE JOB DESCRIPTION
    #-------------------------
    @app.post("/job-description")
    async def save_job_description(job: dict):

        with open("job_description.json", "w") as f:
           json.dump(job, f)

    return {"message": "job description saved"}

#-------------------
#3. EXTRACT PDF TEXT
#-------------------
@app.get("/resume-preview")
async def resume_previe():

    file_path = os.path.join(UPLOAD_DIR,"resume.pdf")

    text = extract_text_from_pdf(file_path)

    return {
        "preview": text[:1000]
    }

#--------------------
#5. LOAD JOB DESCRIPTION
#---------------------
def load_job_description():

    with open("job_description.json", "r") as f:
     data = json.load(f)
    return data["job_description"]

 #------------
# 6. MATCH RESUME + JOB
#-------------------
@app.get("/match")
async def match():
    resume_text = extract_text_from_pdf(os.path.join(UPLOAD_DIR, "resume.pdf"))
    job_text = load_job_description()

    return {
        "resume_preview":
        resume_text[:500],
        "job_description": job_text
    }


    
        
        
    



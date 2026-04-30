from fastapi import APIRouter, UploadFile, File
import pdfplumber
from docx import Document
import io

def extract_text_form_file(filename:str,contents:bytes):
    text = ""

    #PDF
    if file.filename.endswith(".pdf"):
       with  pdfplumber .open(io.BytesIO(content)) as pdf:
         for page in pdf.pages:
           text += page.extract_text() or ""

        # DOCX

    elif file.filename.endswith(".docx"):
      doc = Document(io.BytesIO(content))
    for para in doc. paragraphs:
        text += para.text + "\n"

    else:
        return {"error": "Only PDF and DOCX supported"}
    
    return {
        "preview": text[:300]
    }
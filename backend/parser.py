import pdfplumber
import tempfile

def parse_resume(file_bytes):
     with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        path = tmp.name
    
     text = ""
     with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or""

     return text
                    

            

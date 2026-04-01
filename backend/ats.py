from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
def calculate_ats_score(resume_text,job_description):
    documents = [resume_text, job_description]
    vectorizer = TfidfVectorizer()
    vector = vectorizer.fit_transform(documents)
    score = cosine_similarity(vectors[0],vectors[1])[0][0]
    return round(score *100,2)
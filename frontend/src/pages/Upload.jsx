import { useState, useEffect } from "react";

const API_URL = "https://ai-career-intelligence-platform-rzzm.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080b12;
    font-family: 'DM Sans', sans-serif;
    color: #e8eaf0;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: #080b12;
    position: relative;
    overflow-x: hidden;
  }

  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.12;
    pointer-events: none;
    z-index: 0;
  }
  .orb1 { width: 500px; height: 500px; background: #4f6ef7; top: -100px; left: -100px; }
  .orb2 { width: 400px; height: 400px; background: #7c3aed; bottom: 0; right: -50px; }
  .orb3 { width: 300px; height: 300px; background: #06b6d4; top: 50%; left: 50%; transform: translate(-50%, -50%); }

  .container {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px 60px;
    position: relative;
    z-index: 1;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
    animation: fadeDown 0.7s ease both;
  }
  .badge {
    display: inline-block;
    background: rgba(79, 110, 247, 0.15);
    border: 1px solid rgba(79, 110, 247, 0.4);
    color: #7b9cf9;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 20px;
  }
  .title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 6vw, 52px);
    font-weight: 800;
    line-height: 1.1;
    background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 14px;
  }
  .subtitle {
    color: #6b7280;
    font-size: 15px;
    font-weight: 300;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px;
    backdrop-filter: blur(20px);
    animation: fadeUp 0.7s ease both;
  }
  .card + .card { margin-top: 20px; }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #f1f5f9;
  }
  .input-group { margin-bottom: 16px; }
  .input-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 16px;
    color: #e8eaf0;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .input:focus { border-color: #4f6ef7; background: rgba(79, 110, 247, 0.08); }
  .input::placeholder { color: #374151; }

  .btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #4f6ef7, #7c3aed);
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.5px;
    margin-top: 8px;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-secondary {
    padding: 8px 18px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #9ca3af;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-secondary:hover { background: rgba(255,255,255,0.1); color: #e8eaf0; }

  .file-zone {
    border: 2px dashed rgba(79, 110, 247, 0.3);
    border-radius: 14px;
    padding: 28px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: rgba(79, 110, 247, 0.03);
    margin-bottom: 20px;
  }
  .file-zone:hover { border-color: rgba(79, 110, 247, 0.6); background: rgba(79, 110, 247, 0.07); }
  .file-zone.has-file { border-color: rgba(6, 182, 212, 0.5); background: rgba(6, 182, 212, 0.05); }
  .file-icon { font-size: 32px; margin-bottom: 10px; }
  .file-text { font-size: 14px; color: #6b7280; }
  .file-name { font-size: 13px; color: #06b6d4; font-weight: 500; margin-top: 6px; }
  .file-input-hidden { display: none; }

  .textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 14px 16px;
    color: #e8eaf0;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s;
    margin-bottom: 20px;
  }
  .textarea:focus { border-color: #4f6ef7; }
  .textarea::placeholder { color: #374151; }

  .score-ring { width: 120px; height: 120px; margin: 0 auto 16px; position: relative; }
  .score-ring svg { transform: rotate(-90deg); }
  .score-number {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 800;
    color: #fff;
  }
  .score-label { font-size: 13px; color: #6b7280; letter-spacing: 1px; text-transform: uppercase; }

  .progress-bar { height: 6px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; margin-bottom: 28px; }
  .progress-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #4f6ef7, #06b6d4); transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  @media (max-width: 600px) { .results-grid { grid-template-columns: 1fr; } }

  .result-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; }
  .result-box-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 14px; color: #6b7280; }

  .tag { display: inline-block; padding: 5px 12px; border-radius: 100px; font-size: 12px; font-weight: 500; margin: 3px; }
  .tag-green { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
  .tag-red { background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }

  .section-score-item { margin-bottom: 14px; }
  .section-score-label { display: flex; justify-content: space-between; font-size: 12px; color: #9ca3af; margin-bottom: 6px; }
  .section-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 100px; overflow: hidden; }
  .section-bar-fill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #4f6ef7, #7c3aed); }

  .suggestion-item { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: #9ca3af; line-height: 1.5; }
  .suggestion-item:last-child { border-bottom: none; }
  .suggestion-dot { width: 6px; height: 6px; border-radius: 50%; background: #4f6ef7; margin-top: 6px; flex-shrink: 0; }

  .loading-overlay { text-align: center; padding: 40px; }
  .spinner { width: 40px; height: 40px; border: 3px solid rgba(79,110,247,0.2); border-top-color: #4f6ef7; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
  .loading-text { color: #6b7280; font-size: 14px; }

  .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #f1f5f9; }

  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function ScoreRing({ score }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";
  return (
    <div className="score-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="score-number" style={{ color }}>{score}%</div>
    </div>
  );
}

function Upload() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedResult = localStorage.getItem("result");
    if (savedResult) setResult(JSON.parse(savedResult));
  }, []);

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await fetch(`${API_URL}/login`, { method: "POST", body: formData });
      const data = await response.json();
      if (data.error) alert(data.error);
      else setIsLoggedIn(true);
    } catch { alert("Something went wrong"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) { alert("Please upload a resume and enter job description"); return; }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);
    try {
      setLoading(true);
      setResult(null);
      const response = await fetch(`${API_URL}/upload-resume`, { method: "POST", body: formData });
      if (!response.ok) { alert("Server error"); return; }
      const data = await response.json();
      setResult(data);
      localStorage.setItem("result", JSON.stringify(data));
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
        <div className="container">
          <div className="header">
            <div className="badge">AI Powered · ATS Analysis</div>
            <h1 className="title">Resume Intelligence<br />Platform</h1>
            <p className="subtitle">Beat the bots. Land the interview.</p>
          </div>

          {!isLoggedIn ? (
            <div className="card">
              <p className="login-title">Sign in to continue</p>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <input className="input" type="password" placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={handleLogin}>Continue →</button>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="header-row">
                  <span className="section-title">Analyze Resume</span>
                  <button className="btn-secondary" onClick={() => setIsLoggedIn(false)}>Sign out</button>
                </div>
                <label htmlFor="fileInput">
                  <div className={`file-zone ${file ? "has-file" : ""}`}>
                    <div className="file-icon">{file ? "📄" : "☁️"}</div>
                    <div className="file-text">{file ? "File selected" : "Click to upload PDF or DOCX"}</div>
                    {file && <div className="file-name">{file.name}</div>}
                  </div>
                </label>
                <input id="fileInput" className="file-input-hidden" type="file" accept=".pdf,.docx"
                  onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                <textarea className="textarea" rows={4}
                  placeholder="Paste the job description here..."
                  value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                <button className="btn-primary" onClick={handleUpload} disabled={loading}>
                  {loading ? "Analyzing..." : "Check ATS Score →"}
                </button>
              </div>

              {loading && (
                <div className="card">
                  <div className="loading-overlay">
                    <div className="spinner" />
                    <div className="loading-text">Analyzing your resume with AI...</div>
                  </div>
                </div>
              )}

              {result && !loading && (
                <>
                  <div className="card" style={{ textAlign: "center" }}>
                    <div className="header-row">
                      <span className="section-title">ATS Score</span>
                      <button className="btn-secondary" onClick={() => { localStorage.removeItem("result"); setResult(null); }}>Clear</button>
                    </div>
                    <ScoreRing score={result.ats_score} />
                    <div className="score-label" style={{ marginTop: "8px" }}>
                      {result.ats_score >= 70 ? "🎯 Strong Match" : result.ats_score >= 40 ? "⚠️ Needs Work" : "❌ Low Match"}
                    </div>
                    <div className="progress-bar" style={{ marginTop: "20px" }}>
                      <div className="progress-fill" style={{ width: `${result.ats_score}%` }} />
                    </div>
                  </div>

                  <div className="results-grid">
                    <div className="result-box">
                      <div className="result-box-title">✅ Matched Skills</div>
                      {result?.matched_skills?.length > 0
                        ? result.matched_skills.map((s, i) => <span key={i} className="tag tag-green">{s.charAt(0).toUpperCase() + s.slice(1)}</span>)
                        : <span style={{ color: "#4b5563", fontSize: "13px" }}>None found</span>}
                    </div>
                    <div className="result-box">
                      <div className="result-box-title">❌ Missing Keywords</div>
                      {result?.missing_skills?.length > 0
                        ? result.missing_skills.map((s, i) => <span key={i} className="tag tag-red">{s.charAt(0).toUpperCase() + s.slice(1)}</span>)
                        : <span style={{ color: "#4b5563", fontSize: "13px" }}>None missing 🎉</span>}
                    </div>
                  </div>

                  {result?.section_scores && (
                    <div className="card">
                      <div className="result-box-title" style={{ marginBottom: "20px" }}>📊 Section Breakdown</div>
                      {[
                        { label: "Skills", value: result.section_scores.skills },
                        { label: "Experience", value: result.section_scores.experience },
                        { label: "Education", value: result.section_scores.education },
                      ].map((item, i) => (
                        <div className="section-score-item" key={i}>
                          <div className="section-score-label"><span>{item.label}</span><span>{item.value}%</span></div>
                          <div className="section-bar"><div className="section-bar-fill" style={{ width: `${item.value}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {result?.suggestions?.length > 0 && (
                    <div className="card">
                      <div className="result-box-title" style={{ marginBottom: "16px" }}>💡 Suggestions</div>
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="suggestion-item">
                          <div className="suggestion-dot" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {file && (
                    <div className="card">
                      <div className="result-box-title" style={{ marginBottom: "16px" }}>📄 Resume Preview</div>
                      <iframe src={URL.createObjectURL(file)} width="100%" height="400px"
                        style={{ border: "none", borderRadius: "10px" }} title="Resume Preview" />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Upload;
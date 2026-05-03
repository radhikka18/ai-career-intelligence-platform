import { useState, useEffect } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedResult = localStorage.getItem("result");      // FIXED: getIteam → getItem
    const savedHistory = localStorage.getItem("history");   // FIXED: getIteam → getItem

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));                  // FIXED: Json → JSON
    }
  }, []);

  const handleLogin = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await fetch("http://ai-career-intelligence-platform-rzzm.onrender.com/login", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert("Login success");
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobDesc) {
      alert("Please upload file and enter job description");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);
    try {
      setLoading(true);
      const response = await fetch("https://ai-carrer-intelligence-platform-rzzm.onrender.com/upload-resume", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const text = await response.json();
        alert("Server Error: " + text);
        return;
      }
      const data = await response.json();
      setResult(data);
      const prev = JSON.parse(localStorage.getItem("history")) || [];
      prev.push(data);
      localStorage.setItem("history", JSON.stringify(prev));
      localStorage.setItem("result", JSON.stringify(data));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", textAlign: "center" }}>
      <h2 style={{ color: "blue" }}>AI Resume Analyzer</h2>
      {!isLoggedIn ? (
        <div>
          <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setFile(e.target.files[0]); } }} />
            <br /><br />
            <textarea
              placeholder="Enter job description"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <br /><br />
            <button type="submit" style={{ background: "blue", color: "white", padding: "10px", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>
              {loading ? "Checking..." : "Check ATS"}
            </button>
          </form>
          {loading && <p>Analyzing Resume...</p>}
          {result && (
            <div style={{ marginTop: "20px", padding: "15px", borderRadius: "10px", background: "#f9f9f9" }}>
              <h3>ATS Score: {result.ats_score}%</h3>
              <div style={{ height: "10px", background: "#ddd", borderRadius: "5px", overflow: "hidden", marginBottom: "15px" }}>
                <div style={{ width: `${result.ats_score}%`, height: "100%", background: "green" }}></div>
              </div>
              <button onClick={() => {
                localStorage.removeItem("history");
                localStorage.removeItem("result");
                setHistory([]);
                setResult(null);
              }}>
                Clear History
              </button>
              <h4>Matched Skills</h4>
              <ul>{result?.matched_skills?.map((s, i) => <li key={i}>{s.charAt(0).toUpperCase() + s.slice(1)}</li>)}</ul>
              <h4>Suggestions</h4>
              <ul>{result?.suggestions?.map((s, i) => <li key={i}>{s}</li>)}</ul>
              <h4>Missing Keywords</h4>
              <ul>
                {result?.missing_skills?.map((s, i) => (
                  <li key={i} style={{color:"red"}}>{s}</li>
                ))}
              </ul>

              <h4>Section Scores</h4>
              <ul>
                <li>Skills: {result?.section_scores?.skills}%</li>
                <li>Experience: {result?.section_scores?.experice}%</li>
                <li>Education: {result?.section_scores?.education}%</li>
              </ul>
              {file && <iframe src={URL.createObjectURL(file)} width="100%" height="300px" title="Resume Preview" />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;

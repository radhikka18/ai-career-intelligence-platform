const BASE_URL = "http://127.0.0.1:8000";

export const uploadResume =async (file, jobDesc) => {
    const formData = new FormData();
    formData.append ("file", file);
    formData.append("job_desc", jobDesc);

    const response = await fetch(`${BASE_URL}/upload-resume`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Server error");
    }

    return await response.json();
};
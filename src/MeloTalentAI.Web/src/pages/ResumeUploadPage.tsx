import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  uploadResume,
  type ResumeUploadResponse,
} from "../api/resumes";

export function ResumeUploadPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] =
    useState<ResumeUploadResponse | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please select your resume.");
      return;
    }

    setError("");
    setResult(null);
    setIsUploading(true);

    try {
      const uploadResult = await uploadResume(file);
      setResult(uploadResult);
    } catch (exception) {
      const axiosError = exception as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message ??
          "Unable to upload your resume.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="tool-page">
      <header className="tool-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <strong>Melo Talent AI</strong>
      </header>

      <section className="tool-content">
        <span className="eyebrow">RESUME INTELLIGENCE</span>
        <h1>Upload your resume</h1>
        <p>
          Add your PDF and Melo Talent AI will extract your experience
          for future job compatibility analysis.
        </p>

        <form className="upload-card" onSubmit={handleSubmit}>
          <label className="file-drop">
            <span className="file-icon">↑</span>
            <strong>
              {file ? file.name : "Choose your resume"}
            </strong>
            <small>PDF only · Maximum size 10 MB</small>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) =>
                setFile(event.target.files?.[0] ?? null)
              }
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className="success-message">
              <strong>Resume uploaded successfully!</strong>
              <span>{result.fileName}</span>
              <small>
                {result.characterCount.toLocaleString()} characters
                extracted
              </small>
            </div>
          )}

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Reading your resume..." : "Upload resume"}
          </button>
        </form>
      </section>
    </main>
  );
}

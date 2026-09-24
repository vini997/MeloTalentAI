import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
  analyzeJob,
  type AnalyzeJobResponse,
} from "../api/jobAnalysis";

export function JobAnalysisPage() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] =
    useState<AnalyzeJobResponse | null>(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setIsAnalyzing(true);

    try {
      const analysis = await analyzeJob({
        jobTitle,
        companyName,
        sourceUrl: sourceUrl || undefined,
        jobDescription,
      });

      setResult(analysis);
    } catch (exception) {
      const axiosError = exception as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message ??
          "Unable to analyze this job.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <main className="analysis-page">
      <header className="tool-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <strong>Melo Talent AI</strong>
      </header>

      <section className="analysis-content">
        <div className="analysis-intro">
          <span className="eyebrow">AI JOB MATCHING</span>
          <h1>Analyze your next opportunity.</h1>
          <p>
            Paste the job information and compare its requirements
            against your latest resume.
          </p>
        </div>

        <form className="analysis-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Job title
              <input
                required
                value={jobTitle}
                onChange={(event) =>
                  setJobTitle(event.target.value)
                }
                placeholder="Software Developer"
              />
            </label>

            <label>
              Company
              <input
                required
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
                placeholder="Company name"
              />
            </label>
          </div>

          <label>
            Job URL <span>(optional)</span>
            <input
              value={sourceUrl}
              onChange={(event) =>
                setSourceUrl(event.target.value)
              }
              placeholder="https://..."
            />
          </label>

          <label>
            Job description
            <textarea
              required
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder="Paste the complete job description here..."
              rows={12}
            />
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isAnalyzing}>
            {isAnalyzing
              ? "Analyzing compatibility..."
              : "Analyze compatibility"}
          </button>
        </form>

        {result && (
          <section className="analysis-results">
            <div className="score-card">
              <span>COMPATIBILITY SCORE</span>
              <strong>{result.matchScore}%</strong>
              <p>
                {result.jobTitle} at {result.companyName}
              </p>
            </div>

            <div className="skills-card matching">
              <h2>Matching skills</h2>
              <div className="skill-list">
                {result.matchingSkills.length > 0 ? (
                  result.matchingSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No matching technical skills detected.</p>
                )}
              </div>
            </div>

            <div className="skills-card missing">
              <h2>Skills to strengthen</h2>
              <div className="skill-list">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No missing technical skills detected.</p>
                )}
              </div>
            </div>

            <div className="recommendation-card">
              <span>PERSONALIZED RECOMMENDATION</span>
              <p>{result.recommendations}</p>
            </div>
{result.generatedCoverLetter && (
  <div className="cover-letter-card">
    <span>PERSONALIZED COVER LETTER</span>
    <h2>Cover letter draft</h2>
    <p>{result.generatedCoverLetter}</p>
  </div>
)}

{result.interviewQuestions.length > 0 && (
  <div className="interview-card">
    <span>INTERVIEW PREPARATION</span>
    <h2>Questions you should practice</h2>

    <ol>
      {result.interviewQuestions.map((question, index) => (
        <li key={`${question}-${index}`}>{question}</li>
      ))}
    </ol>
  </div>
)} 
         </section>
        )}
      </section>
    </main>
  );
}

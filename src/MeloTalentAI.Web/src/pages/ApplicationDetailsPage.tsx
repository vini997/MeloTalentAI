import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getApplicationById,
  type ApplicationDetails,
} from "../api/applications";

export function ApplicationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [application, setApplication] =
    useState<ApplicationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      if (!id) {
        setError("Application identifier is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getApplicationById(id);
        setApplication(data);
      } catch {
        setError("Unable to load this application analysis.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplication();
  }, [id]);

  return (
    <main className="application-details-page">
      <header className="tool-header">
        <button
          className="back-button"
          onClick={() => navigate("/applications")}
        >
          ← Applications
        </button>

        <strong>Melo Talent AI</strong>
      </header>

      <section className="application-details-content">
        {isLoading && (
          <div className="details-message">Loading analysis...</div>
        )}

        {error && <div className="error-message">{error}</div>}

        {application && (
          <>
            <div className="details-hero">
              <span className="eyebrow">SAVED JOB ANALYSIS</span>
              <h1>{application.jobTitle}</h1>
              <p>
                {application.companyName} · {application.status}
              </p>

              {application.sourceUrl && (
                <a
                  href={application.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View original job ↗
                </a>
              )}
            </div>

            <div className="details-results-grid">
              <article className="details-score-card">
                <span>COMPATIBILITY SCORE</span>
                <strong>{application.matchScore}%</strong>
                <p>
                  Analyzed{" "}
                  {new Date(
                    application.analyzedAtUtc,
                  ).toLocaleDateString()}
                </p>
              </article>

              <div className="details-skills-column">
                <article className="details-card">
                  <h2>Matching skills</h2>

                  <div className="details-tags">
                    {application.matchingSkills.length > 0 ? (
                      application.matchingSkills.map((skill) => (
                        <span className="matching-tag" key={skill}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No matching skills detected.</p>
                    )}
                  </div>
                </article>

                <article className="details-card">
                  <h2>Skills to strengthen</h2>

                  <div className="details-tags">
                    {application.missingSkills.length > 0 ? (
                      application.missingSkills.map((skill) => (
                        <span className="missing-tag" key={skill}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p>No missing technical skills detected.</p>
                    )}
                  </div>
                </article>
              </div>
            </div>

            <article className="details-card details-wide-card">
              <span className="eyebrow">
                PERSONALIZED RECOMMENDATION
              </span>
              <p>{application.recommendations}</p>
            </article>

            {application.generatedCoverLetter && (
              <article className="details-card details-wide-card">
                <span className="eyebrow">
                  PERSONALIZED COVER LETTER
                </span>
                <h2>Cover letter draft</h2>
                <p className="cover-letter">
                  {application.generatedCoverLetter}
                </p>
              </article>
            )}

            <article className="details-card details-wide-card">
              <span className="eyebrow">INTERVIEW PREPARATION</span>
              <h2>Questions you should practice</h2>

              {application.interviewQuestions.length > 0 ? (
                <ol className="interview-questions">
                  {application.interviewQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
              ) : (
                <p>No interview questions were generated.</p>
              )}
            </article>

            <article className="details-card details-wide-card">
              <span className="eyebrow">JOB DESCRIPTION</span>
              <p className="job-description">
                {application.jobDescription}
              </p>
            </article>
          </>
        )}
      </section>
    </main>
  );
}

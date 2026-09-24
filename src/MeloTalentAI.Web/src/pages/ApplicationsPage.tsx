import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  updateApplicationStatus,
} from "../api/applications";
import type {
  ApplicationStatus,
  JobApplication,
} from "../api/applications";

const statuses: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export function ApplicationsPage() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch {
        setError("Unable to load your applications.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadApplications();
  }, []);

  const totals = useMemo(
    () =>
      statuses.reduce<Record<ApplicationStatus, number>>(
        (result, status) => {
          result[status] = applications.filter(
            (application) => application.status === status,
          ).length;

          return result;
        },
        {
          Saved: 0,
          Applied: 0,
          Interview: 0,
          Offer: 0,
          Rejected: 0,
        },
      ),
    [applications],
  );

  async function handleStatusChange(
    applicationId: string,
    status: ApplicationStatus,
  ) {
    setUpdatingId(applicationId);
    setError("");

    try {
      const updated = await updateApplicationStatus(
        applicationId,
        status,
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? updated
            : application,
        ),
      );
    } catch {
      setError("Unable to update the application status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="applications-page">
      <header className="tool-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <strong>Melo Talent AI</strong>
      </header>

      <section className="applications-content">
        <div className="applications-intro">
          <span className="eyebrow">APPLICATION TRACKER</span>
          <h1>Turn opportunities into progress.</h1>
          <p>
            Organize every analyzed role and keep your next action clear.
          </p>
        </div>

        <div className="application-stats">
          {statuses.map((status) => (
            <article key={status}>
              <strong>{totals[status]}</strong>
              <span>{status}</span>
            </article>
          ))}
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="applications-empty">
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="applications-empty">
            <h2>No applications yet</h2>
            <p>Analyze a job to add your first opportunity.</p>
            <button onClick={() => navigate("/analyze")}>
              Analyze a job
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((application) => (
              <article
                className="application-item"
                key={application.id}
              >
                <div className="application-main">
                  <span className="application-company">
                    {application.companyName}
                  </span>

                  <h2>{application.jobTitle}</h2>

                  <div className="application-meta">
                    <span>
                      Added{" "}
                      {new Date(
                        application.createdAtUtc,
                      ).toLocaleDateString()}
                    </span>

                    {application.matchScore !== undefined && (
                      <span className="application-score">
                        {application.matchScore}% match
                      </span>
                    )}

                    {application.sourceUrl && (
                      <a
                        href={application.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View job ↗
                      </a>
                    )}
                  </div>
                </div>

                <label className="status-control">
                  Status
                  <select
                    value={application.status}
                    disabled={updatingId === application.id}
                    onChange={(event) =>
                      void handleStatusChange(
                        application.id,
                        event.target.value as ApplicationStatus,
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

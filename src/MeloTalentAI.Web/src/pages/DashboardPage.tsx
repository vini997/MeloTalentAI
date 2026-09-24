import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../api/auth";

export function DashboardPage() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("meloTalentAiUser");
  const user: AuthResponse | null = storedUser
    ? JSON.parse(storedUser)
    : null;

  function handleSignOut() {
    localStorage.removeItem("meloTalentAiToken");
    localStorage.removeItem("meloTalentAiUser");
    navigate("/login");
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <strong>Melo Talent AI</strong>
          <span>Your intelligent job-search workspace</span>
        </div>

        <div className="user-area">
          <span>{user?.fullName ?? "Candidate"}</span>
          <button className="secondary-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <span className="eyebrow">DASHBOARD</span>
        <h1>Welcome, {user?.fullName?.split(" ")[0] ?? "Vinicius"}.</h1>
        <p>Let’s turn your experience into your next opportunity.</p>

        <div className="dashboard-grid">
          <article className="feature-card">
            <span>01</span>
            <h2>Upload resume</h2>
            <p>Add your resume so the AI can understand your experience.</p>
	    <button onClick={() => navigate("/resume")}>
  		Upload resume
	    </button>
          </article>

          <article className="feature-card">
            <span>02</span>
            <h2>Analyze a job</h2>
            <p>Compare a job description with your skills and experience.</p>
<button onClick={() => navigate("/analyze")}>
  Start analysis
</button>
          </article>

          <article className="feature-card">
            <span>03</span>
            <h2>Track applications</h2>
            <p>Keep every application, interview, and follow-up organized.</p>
<button onClick={() => navigate("/applications")}>
  View applications
</button>
          </article>
        </div>
      </section>
    </main>
  );
}

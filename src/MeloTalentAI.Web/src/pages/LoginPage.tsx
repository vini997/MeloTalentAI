import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("vinicius@melotalent.ai");
  const [password, setPassword] = useState("MeloTalent2026!");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login({ email, password });

      localStorage.setItem("meloTalentAiToken", result.token);
      localStorage.setItem("meloTalentAiUser", JSON.stringify(result));

      navigate("/dashboard");
    } catch (exception) {
      const axiosError = exception as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message ??
          "Unable to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand">Melo Talent AI</div>

        <div className="hero-content">
          <span className="eyebrow">AI-POWERED JOB SEARCH</span>
          <h1>Turn every application into a stronger opportunity.</h1>
          <p>
            Analyze job compatibility, improve your resume, and organize
            your entire job search in one intelligent workspace.
          </p>
        </div>

        <span className="hero-footer">
          Resume analysis · Skill matching · Application tracking
        </span>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="form-description">
            Continue building your path toward the right opportunity.
          </p>

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="register-link">
            New to Melo Talent AI?{" "}
            <a href="/register">Create an account</a>
          </p>
        </form>
      </section>
    </main>
  );
}

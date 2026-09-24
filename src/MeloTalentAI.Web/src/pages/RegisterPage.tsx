import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await register({ fullName, email, password });

      localStorage.setItem("meloTalentAiToken", result.token);
      localStorage.setItem("meloTalentAiUser", JSON.stringify(result));

      navigate("/dashboard");
    } catch (exception) {
      const axiosError = exception as AxiosError<{
        message?: string;
      }>;

      setError(
        axiosError.response?.data?.message ??
          "Unable to create your account.",
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
          <span className="eyebrow">BUILD YOUR CAREER STRATEGY</span>
          <h1>Your next opportunity starts with better insight.</h1>
          <p>
            Create your workspace, analyze job compatibility, and improve
            every application using artificial intelligence.
          </p>
        </div>

        <span className="hero-footer">
          Resume analysis · Skill matching · Application tracking
        </span>
      </section>

      <section className="auth-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <span className="eyebrow">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="form-description">
            Build a smarter and more organized job search.
          </p>

          <label htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <label htmlFor="registerEmail">Email address</label>
          <input
            id="registerEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="registerPassword">Password</label>
          <input
            id="registerPassword"
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>

          <p className="register-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </section>
    </main>
  );
}

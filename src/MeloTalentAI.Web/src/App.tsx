import { ApplicationsPage } from "./pages/ApplicationsPage";
import { JobAnalysisPage } from "./pages/JobAnalysisPage";
import { ResumeUploadPage } from "./pages/ResumeUploadPage";
import { RegisterPage } from "./pages/RegisterPage";
import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("meloTalentAiToken");

  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
	<Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
<Route
  path="/resume"
  element={
    <ProtectedRoute>
      <ResumeUploadPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/analyze"
  element={
    <ProtectedRoute>
      <JobAnalysisPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/applications"
  element={
    <ProtectedRoute>
      <ApplicationsPage />
    </ProtectedRoute>
  }
/>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

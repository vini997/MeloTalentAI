import { api } from "./client";

export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  sourceUrl?: string;
  status: ApplicationStatus;
  createdAtUtc: string;
  appliedAtUtc?: string;
  matchScore?: number;
}

export interface ApplicationDetails {
  id: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  sourceUrl: string | null;
  status: ApplicationStatus;
  createdAtUtc: string;
  appliedAtUtc: string | null;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string;
  generatedCoverLetter: string | null;
  interviewQuestions: string[];
  analyzedAtUtc: string;
}

export async function getApplications(): Promise<JobApplication[]> {
  const response = await api.get<JobApplication[]>("/api/applications");
  return response.data;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<JobApplication> {
  const response = await api.patch<JobApplication>(
    `/api/applications/${id}/status`,
    { status },
  );

  return response.data;
}

export async function getApplicationById(
  id: string,
): Promise<ApplicationDetails> {
  const response = await api.get<ApplicationDetails>(
    `/api/applications/${id}`,
  );

  return response.data;
}

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


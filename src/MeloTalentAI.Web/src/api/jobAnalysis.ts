import { api } from "./client";

export interface AnalyzeJobRequest {
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  sourceUrl?: string;
}

export interface AnalyzeJobResponse {
  jobApplicationId: string;
  analysisId: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string;
  generatedCoverLetter?: string;
  interviewQuestions: string[];
}

export async function analyzeJob(
  request: AnalyzeJobRequest,
): Promise<AnalyzeJobResponse> {
  const response = await api.post<AnalyzeJobResponse>(
    "/api/job-analysis",
    request,
  );

  return response.data;
}

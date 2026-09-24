import { api } from "./client";

export type ResumeUploadResponse = {
  resumeId: string;
  fileName: string;
  uploadedAtUtc: string;
  characterCount: number;
};

export async function uploadResume(
  file: File,
): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<ResumeUploadResponse>(
    "/api/resumes/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}


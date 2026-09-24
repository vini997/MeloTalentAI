import { api } from "./client";

export type AuthResponse = {
  userId: string;
  fullName: string;
  email: string;
  token: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/api/auth/register",
    request,
  );

  return response.data;
}

export async function login(
  request: LoginRequest,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>(
    "/api/auth/login",
    request,
  );

  return response.data;
}

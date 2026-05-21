import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  OnboardingRequest,
  User,
} from "../types";
import { client } from "./client";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  client.setToken(res.access_token);
  return res;
}

export async function register(data: RegisterRequest): Promise<{ id: string; email: string; name: string }> {
  return client.request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refresh(): Promise<boolean> {
  return client.refresh();
}

export async function logout(): Promise<void> {
  await client.request("/api/auth/logout", { method: "POST" });
  client.setToken(null);
}

export async function onboarding(data: OnboardingRequest): Promise<User> {
  return client.request("/api/auth/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

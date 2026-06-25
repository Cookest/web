import type { AuthResponse } from "../types";

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  const ip = process.env.NEXT_PUBLIC_API_IP;
  const port = process.env.NEXT_PUBLIC_API_PORT || "8080";
  if (typeof window !== "undefined") {
    // Dynamically fallback to the current page hostname or selected IP on the selected port for local network testing
    const protocol = window.location.protocol;
    const hostname = ip || window.location.hostname;
    return `${protocol}//${hostname}:${port}`;
  }
  return `http://${ip || 'localhost'}:${port}`;
};

export const API_BASE = getApiBase();

export class ApiError extends Error {
  constructor(public status: number, public body: string) {
    super(`API Error ${status}: ${body}`);
  }
}

export class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", token);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  }

  getToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (res.status === 401) {
      const refreshed = await this.refresh();
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this.getToken()}`;
        const retryRes = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
          credentials: "include",
        });
        if (!retryRes.ok) {
          throw new ApiError(retryRes.status, await retryRes.text());
        }
        if (retryRes.status === 204) return undefined as T;
        return retryRes.json();
      }
      if (typeof window !== "undefined") {
        this.setToken(null);
        window.location.href = "/login";
      }
      throw new ApiError(401, "Session expired");
    }

    if (!res.ok) {
      const body = await res.text();
      throw new ApiError(res.status, body);
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  async refresh(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data: AuthResponse = await res.json();
      this.setToken(data.access_token);
      return true;
    } catch {
      return false;
    }
  }
}

export const client = new ApiClient();

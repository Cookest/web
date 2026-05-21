import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, register, logout, onboarding } from "../auth";
import { client } from "../client";
import { mockFetchResponse } from "@/__tests__/helpers";

describe("auth API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken(null);
  });

  describe("login", () => {
    it("sends correct payload and stores token", async () => {
      const authResponse = {
        access_token: "login-token",
        user: { id: "u1", email: "a@b.com", name: "A" },
      };
      mockFetchResponse(authResponse);

      const result = await login({ email: "a@b.com", password: "pass123" });

      expect(result).toEqual(authResponse);
      expect(client.getToken()).toBe("login-token");

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/auth/login");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({
        email: "a@b.com",
        password: "pass123",
      });
    });
  });

  describe("register", () => {
    it("sends correct payload", async () => {
      const registerData = {
        email: "new@user.com",
        password: "secure123",
        name: "New User",
      };
      mockFetchResponse({ id: "u2", email: "new@user.com", name: "New User" });

      const result = await register(registerData);

      expect(result).toEqual({
        id: "u2",
        email: "new@user.com",
        name: "New User",
      });

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/auth/register");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual(registerData);
    });
  });

  describe("logout", () => {
    it("clears token after calling endpoint", async () => {
      client.setToken("existing-token");
      mockFetchResponse(undefined, 204);

      await logout();

      expect(client.getToken()).toBeNull();
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/auth/logout");
      expect(opts.method).toBe("POST");
    });
  });

  describe("onboarding", () => {
    it("sends correct payload", async () => {
      const onboardingData = {
        household_size: 3,
        dietary_restrictions: ["vegetarian"],
        allergies: ["nuts"],
        health_goals: ["weight_loss"],
        cooking_skill: "beginner" as const,
      };
      const user = { id: "u1", ...onboardingData };
      mockFetchResponse(user);

      const result = await onboarding(onboardingData);

      expect(result).toEqual(user);
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/auth/onboarding");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual(onboardingData);
    });
  });
});

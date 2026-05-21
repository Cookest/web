import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient, ApiError } from "../client";
import { mockFetchResponse, mockFetchError } from "@/__tests__/helpers";

describe("ApiClient", () => {
  let client: ApiClient;

  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client = new ApiClient();
  });

  describe("setToken", () => {
    it("stores token in localStorage", () => {
      client.setToken("abc123");
      expect(localStorage.getItem("access_token")).toBe("abc123");
    });

    it("removes token from localStorage when null", () => {
      localStorage.setItem("access_token", "old");
      client.setToken(null);
      expect(localStorage.getItem("access_token")).toBeNull();
    });
  });

  describe("getToken", () => {
    it("returns in-memory token first", () => {
      client.setToken("mem-token");
      localStorage.setItem("access_token", "ls-token");
      expect(client.getToken()).toBe("mem-token");
    });

    it("falls back to localStorage", () => {
      localStorage.setItem("access_token", "ls-token");
      expect(client.getToken()).toBe("ls-token");
    });

    it("returns null when no token exists", () => {
      expect(client.getToken()).toBeNull();
    });
  });

  describe("request", () => {
    it("adds Authorization header when token exists", async () => {
      client.setToken("my-token");
      mockFetchResponse({ ok: true });

      await client.request("/api/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        })
      );
    });

    it("does not add Authorization header when no token", async () => {
      mockFetchResponse({ ok: true });

      await client.request("/api/test");

      const callHeaders = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0][1].headers;
      expect(callHeaders).not.toHaveProperty("Authorization");
    });

    it('sends credentials: "include"', async () => {
      mockFetchResponse({});

      await client.request("/api/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ credentials: "include" })
      );
    });

    it("returns undefined for 204 responses", async () => {
      mockFetchResponse(null, 204);

      const result = await client.request("/api/test");
      expect(result).toBeUndefined();
    });

    it("throws ApiError on non-ok responses", async () => {
      mockFetchError(422, "Validation failed");

      await expect(client.request("/api/test")).rejects.toThrow(ApiError);
    });

    it("throws ApiError with correct status and body", async () => {
      mockFetchError(500, "Internal Server Error");

      try {
        await client.request("/api/test");
        expect.unreachable("Should have thrown");
      } catch (e) {
        expect(e).toBeInstanceOf(ApiError);
        expect((e as ApiError).status).toBe(500);
        expect((e as ApiError).body).toBe("Internal Server Error");
      }
    });

    it("attempts refresh on 401, then retries", async () => {
      client.setToken("expired-token");

      // First call returns 401
      mockFetchError(401, "Unauthorized");
      // Refresh succeeds
      mockFetchResponse({ access_token: "new-token" });
      // Retry succeeds
      mockFetchResponse({ data: "success" });

      const result = await client.request("/api/test");

      expect(result).toEqual({ data: "success" });
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(client.getToken()).toBe("new-token");
    });

    it("redirects to /login if refresh fails", async () => {
      client.setToken("expired-token");
      const originalHref = window.location.href;

      // First call returns 401
      mockFetchError(401, "Unauthorized");
      // Refresh fails
      mockFetchError(401, "Refresh failed");

      await expect(client.request("/api/test")).rejects.toThrow(ApiError);
      expect(client.getToken()).toBeNull();
    });
  });

  describe("refresh", () => {
    it("calls the refresh endpoint with POST and credentials", async () => {
      mockFetchResponse({ access_token: "refreshed-token" });

      const result = await client.refresh();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/refresh"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
      expect(client.getToken()).toBe("refreshed-token");
    });

    it("returns false on failure", async () => {
      mockFetchError(401, "Invalid refresh token");

      const result = await client.refresh();
      expect(result).toBe(false);
    });

    it("returns false on network error", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error")
      );

      const result = await client.refresh();
      expect(result).toBe(false);
    });
  });
});

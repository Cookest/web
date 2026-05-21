import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getProfile,
  updateProfile,
  changePassword,
  getFavourites,
  getHistory,
} from "../profile";
import { client } from "../client";
import { mockFetchResponse, factories } from "@/__tests__/helpers";

describe("profile API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("getProfile", () => {
    it("calls GET /api/me", async () => {
      const user = factories.user();
      mockFetchResponse(user);

      const result = await getProfile();

      expect(result).toEqual(user);
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/me");
      expect(opts.method).toBeUndefined(); // defaults to GET
    });
  });

  describe("updateProfile", () => {
    it("sends PUT /api/me", async () => {
      const updated = factories.user({ name: "Updated Name" });
      mockFetchResponse(updated);

      const result = await updateProfile({ name: "Updated Name" });

      expect(result.name).toBe("Updated Name");
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/me");
      expect(opts.method).toBe("PUT");
      expect(JSON.parse(opts.body)).toEqual({ name: "Updated Name" });
    });
  });

  describe("changePassword", () => {
    it("sends correct body", async () => {
      mockFetchResponse(undefined, 204);

      await changePassword("oldpass", "newpass");

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/me/change-password");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({
        current_password: "oldpass",
        new_password: "newpass",
      });
    });
  });

  describe("getFavourites", () => {
    it("builds pagination params", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getFavourites(10, 5);

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/me/favourites");
      expect(url).toContain("limit=10");
      expect(url).toContain("offset=5");
    });

    it("uses default pagination", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getFavourites();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("limit=20");
      expect(url).toContain("offset=0");
    });
  });

  describe("getHistory", () => {
    it("builds pagination params", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getHistory(15, 30);

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/me/history");
      expect(url).toContain("limit=15");
      expect(url).toContain("offset=30");
    });

    it("uses default pagination", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getHistory();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("limit=20");
      expect(url).toContain("offset=0");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchRecipes,
  getRecipe,
  toggleFavourite,
  rateRecipe,
  cookRecipe,
} from "../recipes";
import { client } from "../client";
import { mockFetchResponse, mockFetchError } from "@/__tests__/helpers";

describe("recipes API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("searchRecipes", () => {
    it("builds correct query params", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await searchRecipes({
        q: "pasta",
        category: "dinner",
        difficulty: "easy",
        max_time: 30,
        dietary: "vegetarian",
        limit: 10,
        offset: 20,
      });

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/recipes?");
      expect(url).toContain("q=pasta");
      expect(url).toContain("category=dinner");
      expect(url).toContain("difficulty=easy");
      expect(url).toContain("max_time=30");
      expect(url).toContain("dietary=vegetarian");
      expect(url).toContain("limit=10");
      expect(url).toContain("offset=20");
    });

    it("handles empty params", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await searchRecipes();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/recipes?");
      // No specific params should be set
      expect(url).not.toContain("q=");
      expect(url).not.toContain("category=");
    });
  });

  describe("getRecipe", () => {
    it("encodes ID in URL", async () => {
      mockFetchResponse({ id: "recipe/1", title: "Test" });

      await getRecipe("recipe/1");

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/recipes/recipe%2F1");
    });
  });

  describe("toggleFavourite", () => {
    it("calls POST on favourite endpoint", async () => {
      mockFetchResponse({ is_favourite: true });

      const result = await toggleFavourite("r1");

      expect(result).toEqual({ is_favourite: true });
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/recipes/r1/favourite");
      expect(opts.method).toBe("POST");
    });
  });

  describe("rateRecipe", () => {
    it("sends rating and optional notes", async () => {
      mockFetchResponse(undefined, 204);

      await rateRecipe("r1", 5, "Delicious!");

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/recipes/r1/rate");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({ rating: 5, notes: "Delicious!" });
    });

    it("sends rating without notes", async () => {
      mockFetchResponse(undefined, 204);

      await rateRecipe("r1", 3);

      const body = JSON.parse(
        (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body
      );
      expect(body).toEqual({ rating: 3 });
    });
  });

  describe("cookRecipe", () => {
    it("sends servings", async () => {
      const response = {
        cooked_at: "2024-01-15T10:00:00Z",
        inventory_updated: true,
        ingredients_deducted: 3,
      };
      mockFetchResponse(response);

      const result = await cookRecipe("r1", 4);

      expect(result).toEqual(response);
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/recipes/r1/cook");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({ servings: 4 });
    });
  });
});

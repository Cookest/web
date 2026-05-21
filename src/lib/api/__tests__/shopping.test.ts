import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  clearCheckedItems,
} from "../shopping";
import { client } from "../client";
import { mockFetchResponse } from "@/__tests__/helpers";

describe("shopping API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("getShoppingList", () => {
    it("calls correct endpoint", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getShoppingList();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/shopping-list");
    });
  });

  describe("addShoppingItem", () => {
    it("sends correct body", async () => {
      const data = { ingredient_id: 5, quantity: 2, unit: "kg" };
      mockFetchResponse({ id: "si1", ...data, checked: false });

      const result = await addShoppingItem(data);

      expect(result.id).toBe("si1");
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/shopping-list/items");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual(data);
    });
  });

  describe("toggleShoppingItem", () => {
    it("calls PATCH on check endpoint", async () => {
      mockFetchResponse(undefined, 204);

      await toggleShoppingItem("si1");

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/shopping-list/items/si1/check");
      expect(opts.method).toBe("PATCH");
    });
  });

  describe("clearCheckedItems", () => {
    it("calls DELETE on clear-checked endpoint", async () => {
      mockFetchResponse(undefined, 204);

      await clearCheckedItems();

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/shopping-list/clear-checked");
      expect(opts.method).toBe("DELETE");
    });
  });
});

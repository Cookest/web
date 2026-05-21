import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../inventory";
import { client } from "../client";
import { mockFetchResponse } from "@/__tests__/helpers";

describe("inventory API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("getInventory", () => {
    it("calls endpoint without filters", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getInventory();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/inventory");
      expect(url).not.toContain("?");
    });

    it("builds query params with filters", async () => {
      mockFetchResponse({ items: [], total: 0 });

      await getInventory(true, "fridge");

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("expiring_soon=true");
      expect(url).toContain("location=fridge");
    });
  });

  describe("addInventoryItem", () => {
    it("sends correct body", async () => {
      const item = { ingredient_id: 1, quantity: 500, unit: "g", location: "fridge" };
      mockFetchResponse({ id: "inv1", ...item });

      const result = await addInventoryItem(item);

      expect(result.id).toBe("inv1");
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/inventory");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual(item);
    });
  });

  describe("updateInventoryItem", () => {
    it("sends partial body", async () => {
      const update = { quantity: 300 };
      mockFetchResponse({ id: "inv1", quantity: 300 });

      await updateInventoryItem("inv1", update);

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/inventory/inv1");
      expect(opts.method).toBe("PUT");
      expect(JSON.parse(opts.body)).toEqual(update);
    });
  });

  describe("deleteInventoryItem", () => {
    it("calls DELETE", async () => {
      mockFetchResponse(undefined, 204);

      await deleteInventoryItem("inv1");

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/inventory/inv1");
      expect(opts.method).toBe("DELETE");
    });
  });
});

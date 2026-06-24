import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMealPlans,
  generateMealPlan,
  updateMealSlot,
  getMealPlanNutrition,
} from "../meals";
import { client } from "../client";
import { mockFetchResponse } from "@/__tests__/helpers";

describe("meals API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("getMealPlans", () => {
    it("calls correct endpoint", async () => {
      mockFetchResponse([]);

      await getMealPlans();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/meal-plans");
    });
  });

  describe("generateMealPlan", () => {
    it("sends preferences", async () => {
      const request = {
        days: 7,
        meals_per_day: 3,
        dietary_restrictions: ["vegan"],
        max_prep_time: 45,
      };
      const plan = { id: "mp1", days: 7, slots: [] };
      mockFetchResponse(plan);

      const result = await generateMealPlan(request);

      expect(result).toEqual(plan);
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/meal-plans/generate");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual(request);
    });
  });

  describe("updateMealSlot", () => {
    it("sends partial update", async () => {
      mockFetchResponse(undefined, 204);

      await updateMealSlot("mp1", "slot1", {
        recipe_id: "r2",
        servings: 3,
      });

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/meal-plans/mp1/slots/slot1");
      expect(opts.method).toBe("PUT");
      expect(JSON.parse(opts.body)).toEqual({
        recipe_id: "r2",
        servings: 3,
      });
    });
  });

  describe("getMealPlanNutrition", () => {
    it("calls correct endpoint", async () => {
      const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const nutrition = {
        days: dayNames.map((name, i) => ({
          day: i,
          day_name: name,
          total_calories: 2000 / 7,
          total_protein: 80 / 7,
          total_carbs: 0,
          total_fat: 0,
          meals: [],
        })),
        week_totals: {
          avg_daily_calories: 2000 / 7,
          avg_daily_protein: 80 / 7,
        },
      };
      mockFetchResponse({ calories: 2000, protein: 80 });

      const result = await getMealPlanNutrition("mp1");

      expect(result).toEqual(nutrition);
      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/meal-plans/mp1/nutrition");
    });
  });
});

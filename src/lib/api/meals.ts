import type {
  MealPlan,
  MealPlanListItem,
  GenerateMealPlanRequest,
  MealPlanNutrition,
} from "../types";
import { client } from "./client";

export async function getMealPlans(): Promise<{ items: MealPlanListItem[]; total: number }> {
  return client.request("/api/meal-plans");
}

export async function getMealPlan(id: string): Promise<MealPlan> {
  return client.request(`/api/meal-plans/${encodeURIComponent(id)}`);
}

export async function getCurrentMealPlan(): Promise<MealPlan> {
  return client.request("/api/meal-plans/current");
}

export async function generateMealPlan(data: GenerateMealPlanRequest): Promise<MealPlan> {
  return client.request("/api/meal-plans/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteMealPlan(id: string): Promise<void> {
  return client.request(`/api/meal-plans/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateMealSlot(planId: string, slotId: string, data: Partial<{ recipe_id: string; servings: number; is_flex: boolean; flex_type: string; is_completed: boolean }>): Promise<void> {
  return client.request(`/api/meal-plans/${encodeURIComponent(planId)}/slots/${encodeURIComponent(slotId)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getMealPlanNutrition(id: string): Promise<MealPlanNutrition> {
  const res = await client.request<any>(`/api/meal-plans/${encodeURIComponent(id)}/nutrition`);

  // If the response is the flat mock-like object
  if (res && !res.days && (res.calories_kcal !== undefined || res.calories !== undefined)) {
    const calories = Number(res.calories_kcal || res.calories || 0);
    const protein = Number(res.protein_g || res.protein || 0);
    const carbs = Number(res.carbs_g || res.carbs || 0);
    const fat = Number(res.fat_g || res.fat || 0);

    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const days = dayNames.map((name, i) => ({
      day: i,
      day_name: name,
      total_calories: calories / 7,
      total_protein: protein / 7,
      total_carbs: carbs / 7,
      total_fat: fat / 7,
      meals: [],
    }));

    return {
      days,
      week_totals: {
        avg_daily_calories: calories / 7,
        avg_daily_protein: protein / 7,
      },
    };
  }

  // If the response is already in the new backend format
  return {
    days: (res?.days || []).map((day: any) => ({
      day: Number(day.day ?? 0),
      day_name: String(day.day_name ?? ""),
      total_calories: Number(day.total_calories ?? 0),
      total_protein: Number(day.total_protein ?? 0),
      total_carbs: Number(day.total_carbs ?? 0),
      total_fat: Number(day.total_fat ?? 0),
      meals: Array.isArray(day.meals)
        ? day.meals.map((meal: any) => ({
            meal_type: String(meal.meal_type ?? ""),
            calories: Number(meal.calories ?? 0),
            protein: Number(meal.protein ?? 0),
          }))
        : [],
    })),
    week_totals: {
      avg_daily_calories: Number(res?.week_totals?.avg_daily_calories ?? 0),
      avg_daily_protein: Number(res?.week_totals?.avg_daily_protein ?? 0),
    },
  };
}

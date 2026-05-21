import type {
  MealPlan,
  MealPlanListItem,
  GenerateMealPlanRequest,
  MealPlanNutrition,
} from "../types";
import { client } from "./client";

export async function getMealPlans(): Promise<MealPlanListItem[]> {
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
  return client.request(`/api/meal-plans/${encodeURIComponent(id)}/nutrition`);
}

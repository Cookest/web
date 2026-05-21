import type {
  Recipe,
  RecipeListItem,
  RecipeSearchParams,
  PaginatedResponse,
} from "../types";
import { client } from "./client";

export async function searchRecipes(params: RecipeSearchParams = {}): Promise<PaginatedResponse<RecipeListItem>> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.difficulty) query.set("difficulty", params.difficulty);
  if (params.max_time) query.set("max_time", params.max_time.toString());
  if (params.dietary) query.set("dietary", params.dietary);
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.offset) query.set("offset", params.offset.toString());
  return client.request(`/api/recipes?${query.toString()}`);
}

export async function getRecipe(id: string): Promise<Recipe> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}`);
}

export async function toggleFavourite(id: string): Promise<{ is_favourite: boolean }> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}/favourite`, {
    method: "POST",
  });
}

export async function rateRecipe(id: string, rating: number, notes?: string): Promise<void> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}/rate`, {
    method: "POST",
    body: JSON.stringify({ rating, notes }),
  });
}

export async function cookRecipe(id: string, servings: number): Promise<{ cooked_at: string; inventory_updated: boolean; ingredients_deducted: number }> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}/cook`, {
    method: "POST",
    body: JSON.stringify({ servings }),
  });
}

export async function generateRecipe(prompt: string, use_pantry = false, cuisine_hint?: string, max_minutes?: number): Promise<Recipe> {
  return client.request("/api/recipes/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, use_pantry, cuisine_hint, max_minutes }),
  });
}

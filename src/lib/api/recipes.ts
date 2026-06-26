import type {
  Recipe,
  RecipeListItem,
  RecipeSearchParams,
  PaginatedResponse,
} from "../types";
import { client } from "./client";

export function mapRecipeListItem(r: any): RecipeListItem {
  const prep = 15;
  const cook = r.total_time_min ? Math.max(0, r.total_time_min - prep) : 15;
  return {
    id: String(r.id),
    title: r.name || r.title || "",
    description: r.description || "",
    cuisine: r.cuisine || r.category || "General",
    difficulty: (r.difficulty?.toLowerCase() || "easy") as any,
    prep_time: prep,
    cook_time: cook,
    servings: r.servings || 2,
    calories: r.calories || 350,
    is_favourite: r.is_favourite || false,
    rating_avg: r.average_rating ? Number(r.average_rating) : (r.rating_avg || 0),
    rating_count: r.rating_count || 0,
    image_url: r.primary_image_url || r.image_url || null,
  };
}

export async function searchRecipes(params: RecipeSearchParams = {}): Promise<PaginatedResponse<RecipeListItem>> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.cuisine) query.set("cuisine", params.cuisine);
  if (params.difficulty) query.set("difficulty", params.difficulty);
  if (params.max_time) query.set("max_time", params.max_time.toString());
  if (params.dietary) query.set("dietary", params.dietary);
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.offset) query.set("offset", params.offset.toString());
  
  const res = await client.request<any>(`/api/recipes?${query.toString()}`);

  let rawItems: any[] = [];
  let total = 0;
  let limit = params.limit || 12;
  let offset = params.offset || 0;

  if (Array.isArray(res)) {
    rawItems = res;
    total = res.length;
  } else if (res) {
    rawItems = res.data || res.items || [];
    total = res.total !== undefined ? res.total : rawItems.length;
    limit = res.per_page || res.limit || limit;
    offset = res.offset !== undefined ? res.offset : offset;
  }

  const items = rawItems.map(mapRecipeListItem);

  return {
    items,
    total,
    limit,
    offset,
  };
}

export async function getMyRecipes(params: RecipeSearchParams = {}): Promise<PaginatedResponse<RecipeListItem>> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.cuisine) query.set("cuisine", params.cuisine);
  if (params.difficulty) query.set("difficulty", params.difficulty);
  if (params.max_time) query.set("max_time", params.max_time.toString());
  if (params.dietary) query.set("dietary", params.dietary);
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.offset) query.set("offset", params.offset.toString());
  
  const res = await client.request<any>(`/api/recipes/mine?${query.toString()}`);

  let rawItems: any[] = [];
  let total = 0;
  let limit = params.limit || 12;
  let offset = params.offset || 0;

  if (Array.isArray(res)) {
    rawItems = res;
    total = res.length;
  } else if (res) {
    rawItems = res.data || res.items || [];
    total = res.total !== undefined ? res.total : rawItems.length;
    limit = res.per_page || res.limit || limit;
    offset = res.offset !== undefined ? res.offset : offset;
  }

  const items = rawItems.map(mapRecipeListItem);

  return { items, total, limit, offset };
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

export async function createRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  return client.request("/api/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export async function updateRecipe(id: string, recipe: Partial<Recipe>): Promise<Recipe> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  return client.request(`/api/recipes/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function uploadRecipeImage(id: string, file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/recipes/${encodeURIComponent(id)}/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`, // Assuming client-side auth for now, or token handling in custom client
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image');
  }

  return res.json();
}

import type {
  User,
  UserPreferences,
  RecipeListItem,
  PaginatedResponse,
} from "../types";
import { client } from "./client";

export async function getProfile(): Promise<User> {
  return client.request("/api/me");
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  return client.request("/api/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAccount(): Promise<void> {
  return client.request("/api/me", { method: "DELETE" });
}

export async function changePassword(current_password: string, new_password: string): Promise<void> {
  return client.request("/api/me/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function getPreferences(): Promise<UserPreferences> {
  return client.request("/api/me/preferences");
}

export async function resetPreferences(): Promise<void> {
  return client.request("/api/me/preferences", { method: "DELETE" });
}

export async function getFavourites(limit = 20, offset = 0): Promise<PaginatedResponse<RecipeListItem>> {
  return client.request(`/api/me/favourites?limit=${limit}&offset=${offset}`);
}

export interface CookingHistoryItem {
  id: string;
  recipe_id: number;
  recipe_name: string;
  servings_made: number;
  inventory_deducted: boolean;
  cooked_at: string;
}

export async function getHistory(limit = 20, offset = 0): Promise<CookingHistoryItem[]> {
  return client.request(`/api/me/history?limit=${limit}&offset=${offset}`);
}

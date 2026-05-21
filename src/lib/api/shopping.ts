import type {
  ShoppingItem,
  ShoppingListResponse,
} from "../types";
import { client } from "./client";

export async function getShoppingList(): Promise<ShoppingListResponse> {
  return client.request("/api/shopping-list");
}

export async function addShoppingItem(data: { ingredient_id: number; quantity: number; unit: string }): Promise<ShoppingItem> {
  return client.request("/api/shopping-list/items", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function toggleShoppingItem(id: string): Promise<void> {
  return client.request(`/api/shopping-list/items/${encodeURIComponent(id)}/check`, {
    method: "PATCH",
  });
}

export async function deleteShoppingItem(id: string): Promise<void> {
  return client.request(`/api/shopping-list/items/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function clearCheckedItems(): Promise<void> {
  return client.request("/api/shopping-list/clear-checked", {
    method: "DELETE",
  });
}

export async function syncShoppingList(): Promise<void> {
  return client.request("/api/shopping-list/sync", { method: "POST" });
}

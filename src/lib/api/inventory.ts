import type {
  InventoryItem,
  InventoryResponse,
  AddInventoryRequest,
} from "../types";
import { client } from "./client";

export async function getInventory(expiring_soon?: boolean, location?: string): Promise<InventoryResponse> {
  const query = new URLSearchParams();
  if (expiring_soon) query.set("expiring_soon", "true");
  if (location) query.set("location", location);
  const qs = query.toString();
  return client.request(`/api/inventory${qs ? `?${qs}` : ""}`);
}

export async function addInventoryItem(data: AddInventoryRequest): Promise<InventoryItem> {
  return client.request("/api/inventory", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInventoryItem(id: string, data: Partial<AddInventoryRequest>): Promise<InventoryItem> {
  return client.request(`/api/inventory/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteInventoryItem(id: string): Promise<void> {
  return client.request(`/api/inventory/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

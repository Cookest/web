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

  const res = await client.request<any>(`/api/inventory${qs ? `?${qs}` : ""}`);
  const rawItems = Array.isArray(res) ? res : res?.items || [];

  // Normalize backend fields to match the frontend InventoryItem interface
  let items: InventoryItem[] = rawItems.map((item: any) => ({
    id: String(item.id),
    ingredient_id: Number(item.ingredient_id),
    name: String(item.custom_name || item.ingredient_name || item.name || ""),
    quantity: Number(item.quantity),
    unit: String(item.unit || "pcs"),
    location: String(item.storage_location || item.location || "pantry") as any,
    expiry_date: item.expiry_date || null,
    is_expiring_soon: Boolean(item.expiry_warning !== undefined ? item.expiry_warning : (item.is_expiring_soon || false)),
    added_at: item.added_at || new Date().toISOString(),
  }));

  // Calculate expiring_count globally from the fetched items before other client-side filters
  const expiring_count = items.filter(item => item.is_expiring_soon).length;

  // Apply client-side filters
  if (expiring_soon) {
    items = items.filter(item => item.is_expiring_soon);
  }
  if (location && location !== "all") {
    items = items.filter(item => item.location === location);
  }

  return {
    items,
    expiring_count,
  };
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

import type { NearbyStore } from "../types";
import { client } from "./client";

export async function getNearbyStores(lat: number, lng: number): Promise<NearbyStore[]> {
  return client.request(`/api/stores/nearby?lat=${lat}&lng=${lng}`);
}

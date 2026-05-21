import type { Ingredient } from "../types";
import { client } from "./client";

export async function searchIngredients(q: string): Promise<Ingredient[]> {
  return client.request(`/api/ingredients?q=${encodeURIComponent(q)}`);
}

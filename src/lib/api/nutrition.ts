import type { WhatToBuyItem } from "../types";
import { client } from "./client";

export async function getWhatToBuy(context = ""): Promise<WhatToBuyItem[]> {
  return client.request(`/api/me/what-to-buy?context=${encodeURIComponent(context)}`);
}

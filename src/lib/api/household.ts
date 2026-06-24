import type { Household } from "../types";
import { client } from "./client";

export async function getMyHousehold(): Promise<Household | null> {
  try {
    return await client.request("/api/me/household");
  } catch {
    return null;
  }
}

export async function createHousehold(name: string): Promise<Household> {
  return client.request("/api/households", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function joinHousehold(invite_code: string): Promise<Household> {
  return client.request("/api/households/join", {
    method: "POST",
    body: JSON.stringify({ invite_code }),
  });
}

export async function createHouseholdInvite(householdId: string): Promise<string> {
  const res = await client.request<{ invite_code: string }>(`/api/households/${householdId}/invites`, {
    method: "POST",
  });
  return res.invite_code;
}

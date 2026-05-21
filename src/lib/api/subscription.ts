import type {
  Subscription,
  CheckoutRequest,
  CheckoutResponse,
} from "../types";
import { client } from "./client";

export async function getSubscription(): Promise<Subscription> {
  return client.request("/api/subscription");
}

export async function createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
  return client.request("/api/subscription/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function createPortalSession(return_url: string): Promise<{ portal_url: string }> {
  return client.request("/api/subscription/portal", {
    method: "POST",
    body: JSON.stringify({ return_url }),
  });
}

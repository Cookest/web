"use client";

import { Star, Sparkles, Users } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";

export const PLANS = [
  {
    tier: "free" as const,
    name: "Free",
    price: "$0",
    priceNote: "forever",
    icon: <Star className="h-6 w-6 text-[#7a9a65]" />,
    highlight: false,
    features: ["Browse all recipes", "Pantry management", "Basic shopping list", "10 AI chats per day"],
  },
  {
    tier: "pro" as const,
    name: "Pro",
    price: "$9.99",
    priceNote: "/month",
    icon: <Sparkles className="h-6 w-6 text-[#7a9a65]" />,
    highlight: true,
    features: ["Everything in Free", "AI-powered meal plans", "Unlimited AI chat", "Price comparison", "Create custom recipes"],
  },
  {
    tier: "family" as const,
    name: "Family",
    price: "$14.99",
    priceNote: "/month",
    icon: <Users className="h-6 w-6 text-[#7a9a65]" />,
    highlight: false,
    features: ["Everything in Pro", "Multiple household profiles"],
  },
];

export const TIER_ORDER: Record<string, number> = { free: 0, pro: 1, family: 2 };

export function SubscriptionSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="h-10 w-56 rounded bg-border animate-pulse" />
      <div className="h-16 w-full rounded bg-border animate-pulse" />
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardBody className="space-y-4 p-6">
              <div className="h-6 w-20 rounded bg-border" />
              <div className="h-10 w-24 rounded bg-border" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-border" />
                <div className="h-4 w-3/4 rounded bg-border" />
                <div className="h-4 w-5/6 rounded bg-border" />
              </div>
              <div className="h-10 w-full rounded bg-border" />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

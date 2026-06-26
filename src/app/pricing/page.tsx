"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { client } from "@/lib/api/client";
import { toast } from "sonner";

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect to get started and manage basic recipes.",
    features: [
      "Manage unlimited personal recipes",
      "Publish up to 3 recipes to the community",
      "1 AI Meal Plan generation per week",
      "Basic Grocery List",
    ],
    buttonText: "Current Plan",
    disabled: true,
  },
  {
    name: "Pro",
    price: "$4.99/mo",
    description: "Unlock the full power of Cookest AI.",
    features: [
      "Everything in Free",
      "Unlimited AI Meal Plan generations",
      "Full access to AI Chatbot assistant",
      "AI Grocery Suggestions",
      "Unlimited Recipe publishing",
    ],
    buttonText: "Upgrade to Pro",
    tierId: "pro",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$9.99/mo",
    description: "Share the Pro experience with your whole family.",
    features: [
      "Everything in Pro",
      "Up to 5 family members",
      "Shared meal plans and grocery lists",
    ],
    buttonText: "Upgrade to Family",
    tierId: "family",
  },
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    setLoadingTier(tierId);
    try {
      const res = await client.request<{ url: string }>("/api/subscription/checkout", {
        method: "POST",
        body: JSON.stringify({ tier: tierId }),
      });
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      toast.error(`Checkout failed: ${e.message}`);
      setLoadingTier(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <PageHeader 
          title="Simple, transparent pricing" 
          subtitle="Choose the perfect plan for your cooking needs." 
        />
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-2xl p-8 shadow-sm ring-1 ${
              tier.highlighted
                ? "ring-2 ring-[var(--ck-primary)] bg-[var(--ck-primary-light)]/10"
                : "ring-[var(--ck-border)] bg-[var(--ck-surface)]"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--ck-primary)] px-4 py-1 text-xs font-semibold text-white flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Most Popular
              </div>
            )}
            
            <div className="mb-8 flex-1">
              <h3 className="text-xl font-bold text-[var(--ck-text-heading)]">{tier.name}</h3>
              <p className="mt-4 flex items-baseline text-4xl font-extrabold text-[var(--ck-text-heading)]">
                {tier.price}
              </p>
              <p className="mt-4 text-sm text-[var(--ck-text-muted)]">{tier.description}</p>
              
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 shrink-0 text-[var(--ck-primary)]" />
                    <span className="text-sm text-[var(--ck-text-body)]">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button
              className="w-full mt-auto"
              variant={tier.highlighted ? "primary" : "secondary"}
              disabled={tier.disabled || loadingTier !== null}
              onClick={() => tier.tierId && handleSubscribe(tier.tierId)}
            >
              {loadingTier === tier.tierId ? "Loading..." : tier.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

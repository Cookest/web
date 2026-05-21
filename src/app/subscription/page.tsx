"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Check,
  Crown,
  Users,
  Sparkles,
  Star,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import { api } from "@/lib/api";
import type { Subscription } from "@/lib/types";

interface PlanInfo {
  tier: "free" | "pro" | "family";
  name: string;
  price: string;
  priceNote: string;
  icon: React.ReactNode;
  features: string[];
  highlight?: boolean;
}

const PLANS: PlanInfo[] = [
  {
    tier: "free",
    name: "Free",
    price: "$0",
    priceNote: "forever",
    icon: <Star className="h-6 w-6 text-[#7a9a65]" />,
    features: [
      "Browse all recipes",
      "Pantry management",
      "Basic shopping list",
      "10 AI chats per day",
    ],
  },
  {
    tier: "pro",
    name: "Pro",
    price: "$9.99",
    priceNote: "/month",
    icon: <Sparkles className="h-6 w-6 text-[#7a9a65]" />,
    highlight: true,
    features: [
      "Everything in Free",
      "AI-powered meal plans",
      "Unlimited AI chat",
      "Price comparison",
      "Create custom recipes",
    ],
  },
  {
    tier: "family",
    name: "Family",
    price: "$14.99",
    priceNote: "/month",
    icon: <Users className="h-6 w-6 text-[#7a9a65]" />,
    features: [
      "Everything in Pro",
      "Multiple household profiles",
    ],
  },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trialing: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-600",
  past_due: "bg-red-100 text-red-800",
};

function PlanCardSkeleton() {
  return (
    <Card className="animate-pulse">
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
  );
}

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const sub = await api.getSubscription();
        setSubscription(sub);
      } catch {
        // Default to free if no subscription found
        setSubscription({
          tier: "free",
          status: "active",
          stripe_subscription_id: null,
          valid_until: null,
          cancel_at_period_end: false,
        });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleUpgrade(tier: "pro" | "family") {
    setCheckoutLoading(tier);
    try {
      const { checkout_url } = await api.createCheckout({
        tier,
        success_url: `${window.location.origin}/subscription?success=true`,
        cancel_url: `${window.location.origin}/subscription`,
      });
      window.location.href = checkout_url;
    } catch {
      setCheckoutLoading(null);
    }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const { portal_url } = await api.createPortalSession(
        `${window.location.origin}/subscription`
      );
      window.location.href = portal_url;
    } catch {
      setPortalLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="h-10 w-56 rounded bg-border animate-pulse" />
        <div className="h-16 w-full rounded bg-border animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          <PlanCardSkeleton />
          <PlanCardSkeleton />
          <PlanCardSkeleton />
        </div>
      </div>
    );
  }

  const currentTier = subscription?.tier || "free";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-[#7a9a65]" />
        <h1 className="font-serif text-3xl font-bold text-heading">Subscription</h1>
      </div>

      {/* Current Plan Banner */}
      <Card className="border-[#7a9a65]/30 bg-[#7a9a65]/5">
        <CardBody className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-[#7a9a65]" />
            <div>
              <p className="text-sm text-muted">Current Plan</p>
              <p className="text-lg font-semibold capitalize text-heading">
                {currentTier}
              </p>
            </div>
            <Badge className={STATUS_COLORS[subscription?.status || "active"] || ""}>
              {subscription?.status || "active"}
            </Badge>
          </div>

          {subscription?.valid_until && (
            <p className="text-sm text-muted">
              {subscription.cancel_at_period_end
                ? `Cancels on ${new Date(subscription.valid_until).toLocaleDateString()}`
                : `Renews on ${new Date(subscription.valid_until).toLocaleDateString()}`}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const tierOrder = { free: 0, pro: 1, family: 2 };
          const isDowngrade = tierOrder[plan.tier] < tierOrder[currentTier];

          return (
            <Card
              key={plan.tier}
              className={`relative transition-shadow ${
                isCurrent
                  ? "border-[#7a9a65] ring-2 ring-[#7a9a65]/20"
                  : plan.highlight
                    ? "border-[#7a9a65]/40"
                    : ""
              }`}
            >
              {plan.highlight && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#7a9a65] text-white px-3">Most Popular</Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#7a9a65] text-white px-3">Current Plan</Badge>
                </div>
              )}

              <CardBody className="flex flex-col space-y-5 p-6 pt-8">
                <div className="flex items-center gap-2">
                  {plan.icon}
                  <h3 className="text-xl font-semibold text-heading">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-heading">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.priceNote}</span>
                </div>

                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7a9a65]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : isDowngrade ? (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                  >
                    Manage Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-[#7a9a65] hover:bg-[#6b8a58] text-white"
                    onClick={() => handleUpgrade(plan.tier as "pro" | "family")}
                    disabled={checkoutLoading === plan.tier}
                  >
                    {checkoutLoading === plan.tier ? (
                      "Redirecting…"
                    ) : (
                      <>
                        Upgrade
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Billing Management */}
      {subscription?.stripe_subscription_id && (
        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="font-semibold text-heading">Billing Management</h3>
              <p className="text-sm text-muted">
                Update payment method, view invoices, or cancel your subscription.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleManageBilling}
              disabled={portalLoading}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {portalLoading ? "Opening…" : "Manage Billing"}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

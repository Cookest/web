"use client";

import { useState, useEffect } from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import { Button, Card, CardBody } from "@cookest/ui";
import { api } from "@/lib/api";
import type { Subscription } from "@/lib/types";
import { PricingCard } from "@/components/subscription/pricing-card";
import { CurrentPlanBanner } from "@/components/subscription/current-plan-banner";
import { PLANS, TIER_ORDER, SubscriptionSkeleton } from "@/components/subscription/subscription-data";

const DEFAULT_SUB: Subscription = { tier: "free", status: "active", stripe_subscription_id: null, valid_until: null, cancel_at_period_end: false };

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    api.getSubscription().then(setSubscription).catch(() => setSubscription(DEFAULT_SUB)).finally(() => setIsLoading(false));
  }, []);

  async function handleUpgrade(tier: "pro" | "family") {
    setCheckoutLoading(tier);
    try {
      const { checkout_url } = await api.createCheckout({ tier, success_url: `${window.location.origin}/subscription?success=true`, cancel_url: `${window.location.origin}/subscription` });
      window.location.href = checkout_url;
    } catch { setCheckoutLoading(null); }
  }

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const { portal_url } = await api.createPortalSession(`${window.location.origin}/subscription`);
      window.location.href = portal_url;
    } catch { setPortalLoading(false); }
  }

  if (isLoading) return <SubscriptionSkeleton />;

  const currentTier = subscription?.tier || "free";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <CreditCard className="h-8 w-8 text-[#7a9a65]" />
        <h1 className="font-serif text-3xl font-bold text-heading">Subscription</h1>
      </div>

      <CurrentPlanBanner subscription={subscription!} />

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard
            key={plan.tier}
            tierName={plan.name}
            price={plan.price}
            priceNote={plan.priceNote}
            icon={plan.icon}
            features={plan.features}
            isCurrentPlan={currentTier === plan.tier}
            isFeatured={plan.highlight}
            isDowngrade={TIER_ORDER[plan.tier] < TIER_ORDER[currentTier]}
            onUpgrade={() => handleUpgrade(plan.tier as "pro" | "family")}
            onManage={handleManageBilling}
            isLoading={checkoutLoading === plan.tier}
            portalLoading={portalLoading}
          />
        ))}
      </div>

      {subscription?.stripe_subscription_id && (
        <Card>
          <CardBody className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h3 className="font-semibold text-heading">Billing Management</h3>
              <p className="text-sm text-muted">Update payment method, view invoices, or cancel your subscription.</p>
            </div>
            <Button variant="secondary" onClick={handleManageBilling} disabled={portalLoading}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {portalLoading ? "Opening…" : "Manage Billing"}
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

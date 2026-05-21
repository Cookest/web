"use client";

import { Crown } from "lucide-react";
import { Card, CardBody, Badge } from "@cookest/ui";
import type { Subscription } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  trialing: "bg-blue-100 text-blue-800",
  cancelled: "bg-gray-100 text-gray-600",
  past_due: "bg-red-100 text-red-800",
};

interface CurrentPlanBannerProps {
  subscription: Subscription;
}

export function CurrentPlanBanner({ subscription }: CurrentPlanBannerProps) {
  const status = subscription.status || "active";

  return (
    <Card className="border-[#7a9a65]/30 bg-[#7a9a65]/5">
      <CardBody className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-[#7a9a65]" />
          <div>
            <p className="text-sm text-muted">Current Plan</p>
            <p className="text-lg font-semibold capitalize text-heading">
              {subscription.tier}
            </p>
          </div>
          <Badge className={STATUS_COLORS[status] || ""}>
            {status}
          </Badge>
        </div>

        {subscription.valid_until && (
          <p className="text-sm text-muted">
            {subscription.cancel_at_period_end
              ? `Cancels on ${new Date(subscription.valid_until).toLocaleDateString()}`
              : `Renews on ${new Date(subscription.valid_until).toLocaleDateString()}`}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

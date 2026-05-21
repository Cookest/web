"use client";

import { Check, ArrowRight } from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";

interface PricingCardProps {
  tierName: string;
  price: string;
  priceNote: string;
  icon: React.ReactNode;
  features: string[];
  isCurrentPlan: boolean;
  isFeatured: boolean;
  isDowngrade: boolean;
  onUpgrade: () => void;
  onManage: () => void;
  isLoading: boolean;
  portalLoading: boolean;
}

export function PricingCard({
  tierName,
  price,
  priceNote,
  icon,
  features,
  isCurrentPlan,
  isFeatured,
  isDowngrade,
  onUpgrade,
  onManage,
  isLoading,
  portalLoading,
}: PricingCardProps) {
  return (
    <Card
      className={`relative transition-shadow ${
        isCurrentPlan
          ? "border-[#7a9a65] ring-2 ring-[#7a9a65]/20"
          : isFeatured
            ? "border-[#7a9a65]/40"
            : ""
      }`}
    >
      {isFeatured && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#7a9a65] text-white px-3">Most Popular</Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#7a9a65] text-white px-3">Current Plan</Badge>
        </div>
      )}

      <CardBody className="flex flex-col space-y-5 p-6 pt-8">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-semibold text-heading">{tierName}</h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-heading">{price}</span>
          <span className="text-sm text-muted">{priceNote}</span>
        </div>

        <ul className="flex-1 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7a9a65]" />
              {feature}
            </li>
          ))}
        </ul>

        {isCurrentPlan ? (
          <Button disabled className="w-full">
            Current Plan
          </Button>
        ) : isDowngrade ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={onManage}
            disabled={portalLoading}
          >
            Manage Plan
          </Button>
        ) : (
          <Button
            className="w-full bg-[#7a9a65] hover:bg-[#6b8a58] text-white"
            onClick={onUpgrade}
            disabled={isLoading}
          >
            {isLoading ? (
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
}

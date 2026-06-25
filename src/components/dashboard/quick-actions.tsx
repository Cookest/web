"use client";

import Link from "next/link";
import {
  Sparkles,
  UtensilsCrossed,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Card, CardBody } from "@cookest/ui";

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-[var(--ck-heading)]">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickActionCard
          href="/meal-plans?generate=true"
          icon={<Sparkles className="h-5 w-5 text-[var(--ck-primary-dark)]" />}
          iconBg="bg-[color:color-mix(in_srgb,var(--ck-primary)_12%,transparent)]"
          title="Generate Meal Plan"
          description="AI-powered weekly plan"
        />
        <QuickActionCard
          href="/recipes"
          icon={<UtensilsCrossed className="h-5 w-5 text-[var(--ck-warning)]" />}
          iconBg="bg-[color:color-mix(in_srgb,var(--ck-warning)_12%,transparent)]"
          title="Browse Recipes"
          description="Discover new dishes"
        />
        <QuickActionCard
          href="/chat"
          icon={<MessageSquare className="h-5 w-5 text-[var(--ck-info)]" />}
          iconBg="bg-[color:color-mix(in_srgb,var(--ck-info)_12%,transparent)]"
          title="AI Chef Assistant"
          description="Ask anything about cooking"
        />
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  iconBg,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group">
      <Card variant="interactive">
        <CardBody className="flex items-center gap-4 p-5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-[var(--ck-heading)]">{title}</p>
            <p className="text-sm text-[var(--ck-text-muted)]">{description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[var(--ck-text-muted)] opacity-0 transition-opacity group-hover:opacity-100" />
        </CardBody>
      </Card>
    </Link>
  );
}

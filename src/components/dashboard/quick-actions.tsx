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
      <h2 className="mb-4 text-lg font-semibold text-heading">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickActionCard
          href="/meal-plans?generate=true"
          icon={<Sparkles className="h-5 w-5 text-primary-dark" />}
          iconBg="bg-primary/10"
          title="Generate Meal Plan"
          description="AI-powered weekly plan"
        />
        <QuickActionCard
          href="/recipes"
          icon={<UtensilsCrossed className="h-5 w-5 text-orange-600" />}
          iconBg="bg-orange-500/10"
          title="Browse Recipes"
          description="Discover new dishes"
        />
        <QuickActionCard
          href="/chat"
          icon={<MessageSquare className="h-5 w-5 text-violet-600" />}
          iconBg="bg-violet-500/10"
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
      <Card className="transition-shadow hover:shadow-md">
        <CardBody className="flex items-center gap-4 p-5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-heading">{title}</p>
            <p className="text-sm text-muted">{description}</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </CardBody>
      </Card>
    </Link>
  );
}

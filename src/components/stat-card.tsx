"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";

interface StatCardProps {
  icon: LucideIcon;
  iconClassName?: string;
  label: string;
  value: string | number;
}

export function StatCard({ icon: Icon, iconClassName, label, value }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4 p-5">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClassName ?? "bg-primary/10"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-semibold text-heading">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { AlertTriangle, Check } from "lucide-react";
import { Card, CardBody, Badge } from "@cookest/ui";
import type { InventoryItem } from "@/lib/types";

function daysUntil(dateStr: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

interface ExpiringItemsProps {
  expiringItems: InventoryItem[];
  isLoading: boolean;
}

export function ExpiringItems({ expiringItems, isLoading }: ExpiringItemsProps) {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--ck-heading)]">
            Expiring Soon
          </h2>
          <Link
            href="/inventory"
            className="text-sm text-[var(--ck-primary-dark)] hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 animate-pulse"
              >
                <div className="h-4 w-32 rounded bg-[var(--ck-border)]" />
                <div className="ml-auto h-5 w-16 rounded-full bg-[var(--ck-border)]" />
              </div>
            ))}
          </div>
        ) : expiringItems.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Check className="mb-3 h-10 w-10 text-[var(--ck-primary-dark)] opacity-50" />
            <p className="text-[var(--ck-text-muted)]">Nothing expiring soon!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {expiringItems.map((item) => (
              <ExpiringRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ExpiringRow({ item }: { item: InventoryItem }) {
  const days = item.expiry_date ? daysUntil(item.expiry_date) : null;

  const badgeVariant = days !== null && days <= 1 ? "error" : "warning";
  const badgeLabel =
    days !== null
      ? days <= 0
        ? "Expired"
        : days === 1
          ? "Tomorrow"
          : `${days} days`
      : "Unknown";

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-[var(--ck-bg-card)]">
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--ck-warning)]" />
        <span className="truncate text-sm text-[var(--ck-heading)]">{item.name}</span>
        <span className="text-xs text-[var(--ck-text-muted)]">
          {item.quantity} {item.unit}
        </span>
      </div>
      <Badge variant={badgeVariant}>{badgeLabel}</Badge>
    </div>
  );
}

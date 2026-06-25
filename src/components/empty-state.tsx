"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@cookest/ui";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--ck-primary)_12%,transparent)]">
        <Icon className="h-10 w-10 text-[var(--ck-primary)] opacity-40" />
      </div>
      <h2 className="mb-2 font-serif text-xl font-semibold text-[var(--ck-heading)]">
        {title}
      </h2>
      <p className="mb-6 max-w-sm text-sm text-[var(--ck-text-muted)]">{description}</p>
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button>{action.label}</Button>
          </Link>
        ) : (
          <Button onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}

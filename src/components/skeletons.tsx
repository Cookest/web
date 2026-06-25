"use client";

import { Card, CardBody } from "@cookest/ui";

export function RecipeCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="h-48 bg-border" />
      <CardBody className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-border" />
          <div className="h-5 w-14 rounded-full bg-border" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded bg-border" />
          <div className="h-4 w-16 rounded bg-border" />
          <div className="h-4 w-14 rounded bg-border" />
        </div>
      </CardBody>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardBody className="flex items-center gap-4 p-5">
        <div className="h-10 w-10 rounded-lg bg-border" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded bg-border" />
          <div className="h-6 w-12 rounded bg-border" />
        </div>
      </CardBody>
    </Card>
  );
}

export function MealSlotSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 rounded bg-border" />
        <div className="h-4 w-40 rounded bg-border" />
      </div>
      <div className="h-8 w-24 rounded bg-border" />
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardBody className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="h-4 w-1/2 rounded bg-border" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-border" />
          <div className="h-5 w-20 rounded-full bg-border" />
        </div>
      </CardBody>
    </Card>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 w-full rounded-lg bg-border" />
      <div className="space-y-3">
        <div className="h-8 w-2/3 rounded bg-border" />
        <div className="h-4 w-full rounded bg-border" />
        <div className="h-4 w-5/6 rounded bg-border" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-border" />
        ))}
      </div>
    </div>
  );
}

export function GridSkeleton({
  cols = 4,
  count = 8,
}: {
  cols?: number;
  count?: number;
}) {
  const colsClass: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${colsClass[cols] ?? colsClass[4]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

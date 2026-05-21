"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Refrigerator,
  AlertTriangle,
  Flame,
  Target,
  Sparkles,
  UtensilsCrossed,
  MessageSquare,
  Check,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import type { MealSlot, InventoryItem } from "@/lib/types";

// ── Helpers ──

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000);
}

// ── Skeleton helpers ──

function StatSkeleton() {
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

function MealSkeleton() {
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

// ── Main page ──

export default function Home() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.getInventory(),
  });

  const { data: expiringSoon, isLoading: expiringLoading } = useQuery({
    queryKey: ["inventory", "expiring"],
    queryFn: () => api.getInventory(true),
  });

  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ["meal-plan", "current"],
    queryFn: () => api.getCurrentMealPlan(),
    retry: false,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["history", "week"],
    queryFn: () => api.getHistory(50, 0),
  });

  // Mark a meal slot as completed
  const markCooked = useMutation({
    mutationFn: ({ planId, slotId }: { planId: string; slotId: string }) =>
      api.updateMealSlot(planId, slotId, { is_completed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan", "current"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  // Derived data
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun

  const todaySlots = useMemo(() => {
    if (!mealPlan) return [];
    return mealPlan.slots
      .filter((s) => s.day === dayOfWeek)
      .sort((a, b) => {
        const order = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
        return (order[a.meal_type] ?? 4) - (order[b.meal_type] ?? 4);
      });
  }, [mealPlan, dayOfWeek]);

  const cookedThisWeek = useMemo(() => {
    if (!history) return 0;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return history.items.filter(
      (h) => new Date(h.cooked_at) >= weekStart
    ).length;
  }, [history]);

  const mealPlanCompletion = useMemo(() => {
    if (!mealPlan || mealPlan.slots.length === 0) return 0;
    const completed = mealPlan.slots.filter((s) => s.is_completed).length;
    return Math.round((completed / mealPlan.slots.length) * 100);
  }, [mealPlan]);

  const expiringItems = useMemo(() => {
    if (!expiringSoon) return [];
    return expiringSoon.items
      .filter((item) => item.expiry_date)
      .sort(
        (a, b) =>
          new Date(a.expiry_date!).getTime() -
          new Date(b.expiry_date!).getTime()
      )
      .slice(0, 6);
  }, [expiringSoon]);

  const statsLoading =
    inventoryLoading || expiringLoading || historyLoading || mealPlanLoading;

  // ── Render ──

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="font-serif text-3xl text-heading">
          {getGreeting()}, {user?.name?.split(" ")[0] ?? "Chef"}
        </h1>
        <p className="mt-1 text-muted">{formatDate(today)}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Refrigerator className="h-5 w-5 text-primary-dark" />
                </div>
                <div>
                  <p className="text-sm text-muted">Pantry Items</p>
                  <p className="text-2xl font-semibold text-heading">
                    {inventory?.items.length ?? 0}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted">Expiring Soon</p>
                  <p className="text-2xl font-semibold text-heading">
                    {expiringSoon?.expiring_count ?? 0}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted">Cooked This Week</p>
                  <p className="text-2xl font-semibold text-heading">
                    {cookedThisWeek}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary-dark" />
                </div>
                <div>
                  <p className="text-sm text-muted">Meal Plan</p>
                  <p className="text-2xl font-semibold text-heading">
                    {mealPlanCompletion}%
                  </p>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>

      {/* Two-column layout: Today's meals + Expiring soon */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Meals */}
        <Card>
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-heading">
                Today&apos;s Meals
              </h2>
              {mealPlan && (
                <Link
                  href={`/meal-plans/${mealPlan.id}`}
                  className="text-sm text-primary-dark hover:underline"
                >
                  View plan
                </Link>
              )}
            </div>

            {mealPlanLoading ? (
              <div className="space-y-3">
                <MealSkeleton />
                <MealSkeleton />
                <MealSkeleton />
              </div>
            ) : todaySlots.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <UtensilsCrossed className="mb-3 h-10 w-10 text-muted/50" />
                <p className="text-muted">No meals planned for today</p>
                <Link href="/meal-plans">
                  <Button variant="secondary" size="sm" className="mt-3">
                    Generate a Plan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {todaySlots.map((slot) => (
                  <MealSlotRow
                    key={slot.id}
                    slot={slot}
                    onMarkCooked={() =>
                      markCooked.mutate({
                        planId: mealPlan!.id,
                        slotId: slot.id,
                      })
                    }
                    isPending={markCooked.isPending}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardBody className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-heading">
                Expiring Soon
              </h2>
              <Link
                href="/inventory"
                className="text-sm text-primary-dark hover:underline"
              >
                View all
              </Link>
            </div>

            {expiringLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="h-4 w-32 rounded bg-border" />
                    <div className="ml-auto h-5 w-16 rounded-full bg-border" />
                  </div>
                ))}
              </div>
            ) : expiringItems.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Check className="mb-3 h-10 w-10 text-primary-dark/50" />
                <p className="text-muted">Nothing expiring soon!</p>
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
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-heading">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/meal-plans?generate=true" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary-dark" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-heading">
                    Generate Meal Plan
                  </p>
                  <p className="text-sm text-muted">
                    AI-powered weekly plan
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </CardBody>
            </Card>
          </Link>

          <Link href="/recipes" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-heading">Browse Recipes</p>
                  <p className="text-sm text-muted">
                    Discover new dishes
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </CardBody>
            </Card>
          </Link>

          <Link href="/chat" className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardBody className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <MessageSquare className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-heading">
                    AI Chef Assistant
                  </p>
                  <p className="text-sm text-muted">
                    Ask anything about cooking
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function MealSlotRow({
  slot,
  onMarkCooked,
  isPending,
}: {
  slot: MealSlot;
  onMarkCooked: () => void;
  isPending: boolean;
}) {
  const mealLabel =
    slot.meal_type.charAt(0).toUpperCase() + slot.meal_type.slice(1);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Clock className="h-4 w-4 text-primary-dark" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {mealLabel}
        </p>
        <p className="truncate font-medium text-heading">
          {slot.recipe_title}
        </p>
      </div>
      {slot.is_completed ? (
        <Badge variant="success">Cooked</Badge>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkCooked}
          disabled={isPending}
        >
          <Check className="mr-1 h-3.5 w-3.5" />
          Mark cooked
        </Button>
      )}
    </div>
  );
}

function ExpiringRow({ item }: { item: InventoryItem }) {
  const days = item.expiry_date ? daysUntil(item.expiry_date) : null;

  const badgeVariant =
    days !== null && days <= 1 ? "error" : "warning";
  const badgeLabel =
    days !== null
      ? days <= 0
        ? "Expired"
        : days === 1
          ? "Tomorrow"
          : `${days} days`
      : "Unknown";

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-surface">
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
        <span className="truncate text-sm text-heading">{item.name}</span>
        <span className="text-xs text-muted">
          {item.quantity} {item.unit}
        </span>
      </div>
      <Badge variant={badgeVariant}>{badgeLabel}</Badge>
    </div>
  );
}

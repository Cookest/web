"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UtensilsCrossed, Check, Clock } from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import { api } from "@/lib/api";
import { MealSlotSkeleton } from "@/components/skeletons";
import type { MealPlan, MealSlot } from "@/lib/types";

interface TodaysMealsProps {
  mealPlan: MealPlan | undefined;
  isLoading: boolean;
}

export function TodaysMeals({ mealPlan, isLoading }: TodaysMealsProps) {
  const queryClient = useQueryClient();
  const dayOfWeek = new Date().getDay();

  const todaySlots = useMemo(() => {
    if (!mealPlan) return [];
    return mealPlan.slots
      .filter((s) => s.day === dayOfWeek)
      .sort((a, b) => {
        const order = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
        return (order[a.meal_type] ?? 4) - (order[b.meal_type] ?? 4);
      });
  }, [mealPlan, dayOfWeek]);

  const markCooked = useMutation({
    mutationFn: ({ planId, slotId }: { planId: string; slotId: string }) =>
      api.updateMealSlot(planId, slotId, { is_completed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plan", "current"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return (
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

        {isLoading ? (
          <div className="space-y-3">
            <MealSlotSkeleton />
            <MealSlotSkeleton />
            <MealSlotSkeleton />
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
  );
}

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

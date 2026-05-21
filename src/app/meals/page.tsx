"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@cookest/ui";
import {
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  addDays,
} from "date-fns";
import { api } from "@/lib/api";
import type { MealSlot, GenerateMealPlanRequest } from "@/lib/types";
import { MealGrid, MealGridSkeleton } from "@/components/meals/meal-grid";
import { GenerateModal } from "@/components/meals/generate-modal";
import { NutritionSummary } from "@/components/meals/nutrition-summary";
import { EmptyState } from "@/components/empty-state";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startStr = format(weekStart, "MMM d");
  const endStr =
    weekStart.getMonth() === weekEnd.getMonth()
      ? format(weekEnd, "d, yyyy")
      : format(weekEnd, "MMM d, yyyy");
  return `${startStr} - ${endStr}`;
}

export default function MealsPage() {
  const queryClient = useQueryClient();
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(new Date()));
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const {
    data: mealPlan,
    isLoading,
  } = useQuery({
    queryKey: ["current-meal-plan"],
    queryFn: () => api.getCurrentMealPlan(),
    retry: false,
  });

  const generateMutation = useMutation({
    mutationFn: (data: GenerateMealPlanRequest) => api.generateMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-meal-plan"] });
      setShowGenerateModal(false);
    },
  });

  const updateSlotMutation = useMutation({
    mutationFn: ({
      slotId,
      data,
    }: {
      slotId: string;
      data: Partial<{ is_completed: boolean; is_flex: boolean; flex_type: string }>;
    }) => api.updateMealSlot(mealPlan!.id, slotId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-meal-plan"] });
      queryClient.invalidateQueries({
        queryKey: ["meal-plan-nutrition", mealPlan?.id],
      });
    },
  });

  const slotGrid = useMemo(() => {
    if (!mealPlan) return null;
    const grid: Record<string, Record<string, MealSlot | null>> = {};
    for (let day = 0; day < 7; day++) {
      grid[day] = {};
      for (const type of MEAL_TYPES) {
        grid[day][type] = null;
      }
    }
    for (const slot of mealPlan.slots) {
      if (slot.day >= 0 && slot.day <= 6 && grid[slot.day]) {
        grid[slot.day][slot.meal_type] = slot;
      }
    }
    return grid;
  }, [mealPlan]);

  const weekStart = mealPlan ? new Date(mealPlan.week_start) : currentWeek;

  function handleMarkCooked(slotId: string, completed: boolean) {
    updateSlotMutation.mutate({ slotId, data: { is_completed: completed } });
  }

  function handleToggleFlex(slotId: string, isFlex: boolean) {
    updateSlotMutation.mutate({
      slotId,
      data: { is_flex: isFlex, flex_type: isFlex ? "effort" : undefined },
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-heading">
            Meal Plan
          </h1>
          {mealPlan && (
            <p className="mt-1 text-muted">{formatWeekRange(weekStart)}</p>
          )}
        </div>
        <Button
          onClick={() => setShowGenerateModal(true)}
          className="bg-[#7a9a65] text-white hover:bg-[#6b8a57]"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>

      {/* Week navigation */}
      {mealPlan && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentWeek((w) => subWeeks(w, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-[#f0f4ec] transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-heading" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-heading">
            <CalendarDays className="h-4 w-4 text-[#7a9a65]" />
            {formatWeekRange(weekStart)}
          </div>
          <button
            type="button"
            onClick={() => setCurrentWeek((w) => addWeeks(w, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-[#f0f4ec] transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-heading" />
          </button>
        </div>
      )}

      {isLoading && <MealGridSkeleton />}

      {!isLoading && !mealPlan && (
        <EmptyState
          icon={CalendarDays}
          title="No meal plan yet"
          description="Generate a personalized weekly meal plan based on your preferences and pantry items."
          action={{ label: "Generate Meal Plan", onClick: () => setShowGenerateModal(true) }}
        />
      )}

      {!isLoading && mealPlan && slotGrid && (
        <MealGrid
          mealPlan={mealPlan}
          slotGrid={slotGrid}
          weekStart={weekStart}
          onMarkCooked={handleMarkCooked}
          onToggleFlex={handleToggleFlex}
        />
      )}

      {!isLoading && mealPlan && <NutritionSummary planId={mealPlan.id} />}

      <GenerateModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={(data) => generateMutation.mutate(data)}
        isGenerating={generateMutation.isPending}
      />
    </div>
  );
}

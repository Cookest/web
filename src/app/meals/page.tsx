"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Clock,
  Flame,
  Dumbbell,
  Utensils,
  Plus,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Badge,
  Checkbox,
  Progress,
  Input,
} from "@cookest/ui";
import {
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  isSameWeek,
} from "date-fns";
import { api } from "@/lib/api";
import type {
  MealPlan,
  MealSlot,
  GenerateMealPlanRequest,
  MealPlanNutrition,
} from "@/lib/types";

// ── Constants ──

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

const FLEX_COLORS: Record<string, string> = {
  effort: "bg-amber-100 text-amber-800",
  nutrition: "bg-emerald-100 text-emerald-800",
  mental: "bg-purple-100 text-purple-800",
  social: "bg-blue-100 text-blue-800",
};

const CUISINES = [
  "Italian",
  "Asian",
  "Mediterranean",
  "Mexican",
  "French",
  "Indian",
  "American",
  "Japanese",
] as const;

// ── Helpers ──

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

// ── Skeleton ──

function SlotSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border bg-card p-3 space-y-2">
      <div className="h-10 w-full rounded bg-border" />
      <div className="h-4 w-3/4 rounded bg-border" />
      <div className="h-3 w-1/2 rounded bg-border" />
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 21 }).map((_, i) => (
        <SlotSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Meal Slot Card ──

function MealSlotCard({
  slot,
  planId,
  onMarkCooked,
  onToggleFlex,
}: {
  slot: MealSlot;
  planId: string;
  onMarkCooked: (slotId: string, completed: boolean) => void;
  onToggleFlex: (slotId: string, isFlex: boolean) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-sm cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Completed overlay */}
      {slot.is_completed && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[#4caf50]/10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4caf50]">
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Image placeholder */}
      <div className="mb-2 flex h-10 items-center justify-center rounded bg-[#f0f4ec]">
        <Utensils className="h-5 w-5 text-[#7a9a65]/40" />
      </div>

      {/* Title */}
      <Link
        href={`/recipes/${slot.recipe_id}`}
        className="block text-sm font-medium text-heading leading-tight line-clamp-2 hover:text-[#7a9a65] transition-colors"
      >
        {slot.recipe_title}
      </Link>

      {/* Meta */}
      <div className="mt-1 flex items-center gap-1 text-xs text-muted">
        <Clock className="h-3 w-3" />
        <span>{slot.servings} servings</span>
      </div>

      {/* Flex badge */}
      {slot.is_flex && slot.flex_type && (
        <Badge
          className={`mt-1.5 text-[10px] capitalize ${FLEX_COLORS[slot.flex_type]}`}
        >
          {slot.flex_type}
        </Badge>
      )}

      {/* Actions on hover */}
      {showActions && !slot.is_completed && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1 rounded-b-lg border-t border-border bg-surface p-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkCooked(slot.id, true);
            }}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-heading hover:bg-[#7a9a65]/10 transition-colors"
          >
            <Check className="h-3 w-3 text-[#4caf50]" />
            Mark as cooked
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFlex(slot.id, !slot.is_flex);
            }}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-heading hover:bg-[#7a9a65]/10 transition-colors"
          >
            <Sparkles className="h-3 w-3 text-[#ff9800]" />
            {slot.is_flex ? "Remove flex" : "Mark as flex"}
          </button>
          <Link
            href={`/recipes/${slot.recipe_id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-heading hover:bg-[#7a9a65]/10 transition-colors"
          >
            <Utensils className="h-3 w-3 text-[#7a9a65]" />
            Swap recipe
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Empty Slot ──

function EmptySlot() {
  return (
    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-3 min-h-[100px]">
      <span className="text-xs text-muted">No meal planned</span>
    </div>
  );
}

// ── Generate Modal ──

function GenerateModal({
  open,
  onClose,
  onGenerate,
  isGenerating,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (data: GenerateMealPlanRequest) => void;
  isGenerating: boolean;
}) {
  const [weekStart, setWeekStart] = useState(
    format(getWeekStart(new Date()), "yyyy-MM-dd")
  );
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [avoidRepeated, setAvoidRepeated] = useState(false);

  if (!open) return null;

  function handleCuisineToggle(cuisine: string) {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: GenerateMealPlanRequest = {
      week_start: weekStart,
      preferences: {
        max_prep_time: maxPrepTime ? Number(maxPrepTime) : undefined,
        cuisines: selectedCuisines.length > 0 ? selectedCuisines : undefined,
        avoid_repeated: avoidRepeated || undefined,
      },
    };
    onGenerate(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-heading">
              Generate Meal Plan
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-border transition-colors"
            >
              <X className="h-4 w-4 text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Week start */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading">
                Week starting
              </label>
              <Input
                type="date"
                value={weekStart}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeekStart(e.target.value)
                }
              />
            </div>

            {/* Max prep time */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading">
                Max prep time (minutes)
              </label>
              <Input
                type="number"
                placeholder="e.g. 45"
                value={maxPrepTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaxPrepTime(e.target.value)
                }
                min={0}
              />
            </div>

            {/* Cuisines */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Cuisine preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CUISINES.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex items-center gap-2 text-sm text-heading cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCuisines.includes(
                        cuisine.toLowerCase()
                      )}
                      onCheckedChange={() =>
                        handleCuisineToggle(cuisine.toLowerCase())
                      }
                    />
                    {cuisine}
                  </label>
                ))}
              </div>
            </div>

            {/* Avoid repeated */}
            <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
              <Checkbox
                checked={avoidRepeated}
                onCheckedChange={(checked: boolean) =>
                  setAvoidRepeated(checked)
                }
              />
              Avoid repeated recipes
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-[#7a9a65] text-white hover:bg-[#6b8a57]"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Generating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </span>
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

// ── Nutrition Summary ──

function NutritionSummary({ planId }: { planId: string }) {
  const { data: nutrition, isLoading } = useQuery({
    queryKey: ["meal-plan-nutrition", planId],
    queryFn: () => api.getMealPlanNutrition(planId),
  });

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardBody className="p-6 space-y-4">
          <div className="h-5 w-48 rounded bg-border" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded bg-border" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-20 rounded bg-border" />
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!nutrition) return null;

  const maxCalories = Math.max(
    ...nutrition.days.map((d) => d.total_calories),
    1
  );

  return (
    <Card>
      <CardBody className="p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold text-heading">
          Nutrition Summary
        </h3>

        {/* Weekly averages */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[#fafaf6] p-3 text-center">
            <Flame className="mx-auto mb-1 h-5 w-5 text-[#ff9800]" />
            <div className="text-lg font-semibold text-heading">
              {Math.round(nutrition.week_totals.avg_daily_calories)}
            </div>
            <div className="text-xs text-muted">Avg. calories/day</div>
          </div>
          <div className="rounded-lg bg-[#fafaf6] p-3 text-center">
            <Dumbbell className="mx-auto mb-1 h-5 w-5 text-[#7a9a65]" />
            <div className="text-lg font-semibold text-heading">
              {Math.round(nutrition.week_totals.avg_daily_protein)}g
            </div>
            <div className="text-xs text-muted">Avg. protein/day</div>
          </div>
          <div className="rounded-lg bg-[#fafaf6] p-3 text-center">
            <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center text-[#2196f3] font-bold text-xs">
              C
            </div>
            <div className="text-lg font-semibold text-heading">
              {nutrition.days.length > 0
                ? Math.round(
                    nutrition.days.reduce((s, d) => s + d.total_carbs, 0) /
                      nutrition.days.length
                  )
                : 0}
              g
            </div>
            <div className="text-xs text-muted">Avg. carbs/day</div>
          </div>
          <div className="rounded-lg bg-[#fafaf6] p-3 text-center">
            <div className="mx-auto mb-1 flex h-5 w-5 items-center justify-center text-[#e91e63] font-bold text-xs">
              F
            </div>
            <div className="text-lg font-semibold text-heading">
              {nutrition.days.length > 0
                ? Math.round(
                    nutrition.days.reduce((s, d) => s + d.total_fat, 0) /
                      nutrition.days.length
                  )
                : 0}
              g
            </div>
            <div className="text-xs text-muted">Avg. fat/day</div>
          </div>
        </div>

        {/* Daily bars */}
        <div className="grid grid-cols-7 gap-2">
          {nutrition.days.map((day) => (
            <div key={day.day} className="text-center space-y-1">
              <div className="text-xs font-medium text-heading">
                {day.day_name.slice(0, 3)}
              </div>
              <div className="relative mx-auto h-24 w-6 rounded-full bg-border overflow-hidden">
                <div
                  className="absolute bottom-0 w-full rounded-full bg-[#7a9a65] transition-all"
                  style={{
                    height: `${(day.total_calories / maxCalories) * 100}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-muted">
                {Math.round(day.total_calories)}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// ── Empty State ──

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4ec]">
        <CalendarDays className="h-8 w-8 text-[#7a9a65]" />
      </div>
      <h2 className="mb-2 font-serif text-2xl font-semibold text-heading">
        No meal plan yet
      </h2>
      <p className="mb-6 max-w-sm text-muted">
        Generate a personalized weekly meal plan based on your preferences and
        pantry items.
      </p>
      <Button
        onClick={onGenerate}
        className="bg-[#7a9a65] text-white hover:bg-[#6b8a57]"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Generate Meal Plan
      </Button>
    </div>
  );
}

// ── Page ──

export default function MealsPage() {
  const queryClient = useQueryClient();
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart(new Date()));
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Fetch current meal plan
  const {
    data: mealPlan,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["current-meal-plan"],
    queryFn: () => api.getCurrentMealPlan(),
    retry: false,
  });

  // Generate meal plan
  const generateMutation = useMutation({
    mutationFn: (data: GenerateMealPlanRequest) => api.generateMealPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-meal-plan"] });
      setShowGenerateModal(false);
    },
  });

  // Update meal slot
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

  // Build grid data: map day × meal_type → slot
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

  // Week navigation — update the currentWeek based on the meal plan
  const weekStart = mealPlan
    ? new Date(mealPlan.week_start)
    : currentWeek;

  function handleMarkCooked(slotId: string, completed: boolean) {
    updateSlotMutation.mutate({ slotId, data: { is_completed: completed } });
  }

  function handleToggleFlex(slotId: string, isFlex: boolean) {
    updateSlotMutation.mutate({
      slotId,
      data: { is_flex: isFlex, flex_type: isFlex ? "effort" : undefined },
    });
  }

  // ── Render ──

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-heading">
            Meal Plan
          </h1>
          {mealPlan && (
            <p className="mt-1 text-muted">
              {formatWeekRange(weekStart)}
            </p>
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

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-2">
            {/* Row header placeholder */}
            <div />
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-8 animate-pulse rounded bg-border"
              />
            ))}
          </div>
          <GridSkeleton />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !mealPlan && (
        <EmptyState onGenerate={() => setShowGenerateModal(true)} />
      )}

      {/* Weekly grid */}
      {!isLoading && mealPlan && slotGrid && (
        <Card>
          <CardBody className="overflow-x-auto p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-20 p-2 text-left text-xs font-medium uppercase text-muted" />
                  {DAYS.map((day, i) => {
                    const dayDate = addDays(weekStart, i);
                    const isToday = isSameWeek(dayDate, new Date(), {
                      weekStartsOn: 1,
                    })
                      && dayDate.getDate() === new Date().getDate()
                      && dayDate.getMonth() === new Date().getMonth();
                    return (
                      <th
                        key={day}
                        className={`p-2 text-center text-xs font-medium uppercase ${
                          isToday ? "text-[#7a9a65]" : "text-muted"
                        }`}
                      >
                        <div>{day.slice(0, 3)}</div>
                        <div
                          className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                            isToday
                              ? "bg-[#7a9a65] text-white font-semibold"
                              : "text-heading"
                          }`}
                        >
                          {format(dayDate, "d")}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {MEAL_TYPES.map((mealType) => (
                  <tr key={mealType}>
                    <td className="p-2 text-xs font-medium capitalize text-muted align-top pt-4">
                      {mealType}
                    </td>
                    {DAYS.map((_, dayIndex) => {
                      const slot = slotGrid[dayIndex]?.[mealType];
                      return (
                        <td key={dayIndex} className="p-1 align-top">
                          {slot ? (
                            <MealSlotCard
                              slot={slot}
                              planId={mealPlan.id}
                              onMarkCooked={handleMarkCooked}
                              onToggleFlex={handleToggleFlex}
                            />
                          ) : (
                            <EmptySlot />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}

      {/* Nutrition summary */}
      {!isLoading && mealPlan && <NutritionSummary planId={mealPlan.id} />}

      {/* Generate modal */}
      <GenerateModal
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onGenerate={(data) => generateMutation.mutate(data)}
        isGenerating={generateMutation.isPending}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Clock,
  Utensils,
} from "lucide-react";
import { Card, CardBody, Badge } from "@cookest/ui";
import { addDays, format, isSameWeek } from "date-fns";
import type { MealPlan, MealSlot } from "@/lib/types";

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

// ── Meal Slot Card ──

function MealSlotCard({
  slot,
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

// ── Grid Skeleton ──

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
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2">
        <div />
        {DAYS.map((day) => (
          <div key={day} className="h-8 animate-pulse rounded bg-border" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 21 }).map((_, i) => (
          <SlotSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ── Props ──

interface MealGridProps {
  mealPlan: MealPlan;
  slotGrid: Record<string, Record<string, MealSlot | null>>;
  weekStart: Date;
  onMarkCooked: (slotId: string, completed: boolean) => void;
  onToggleFlex: (slotId: string, isFlex: boolean) => void;
}

export { GridSkeleton as MealGridSkeleton };

export function MealGrid({
  mealPlan,
  slotGrid,
  weekStart,
  onMarkCooked,
  onToggleFlex,
}: MealGridProps) {
  return (
    <Card>
      <CardBody className="overflow-x-auto p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-20 p-2 text-left text-xs font-medium uppercase text-muted" />
              {DAYS.map((day, i) => {
                const dayDate = addDays(weekStart, i);
                const isToday =
                  isSameWeek(dayDate, new Date(), { weekStartsOn: 1 }) &&
                  dayDate.getDate() === new Date().getDate() &&
                  dayDate.getMonth() === new Date().getMonth();
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
                          onMarkCooked={onMarkCooked}
                          onToggleFlex={onToggleFlex}
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
  );
}

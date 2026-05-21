"use client";

import { useQuery } from "@tanstack/react-query";
import { Flame, Dumbbell } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";
import { api } from "@/lib/api";

interface NutritionSummaryProps {
  planId: string;
}

export function NutritionSummary({ planId }: NutritionSummaryProps) {
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

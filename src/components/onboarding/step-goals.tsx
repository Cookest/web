"use client";

import { Target } from "lucide-react";
import { Checkbox } from "@cookest/ui";
import { HEALTH_GOALS } from "@/lib/constants";

interface StepGoalsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function StepGoals({ selected, onChange }: StepGoalsProps) {
  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
        <h2 className="font-serif text-xl font-semibold text-heading">
          What are your health goals?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Select any that apply. We&apos;ll tailor meal suggestions.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {HEALTH_GOALS.map((goal) => (
          <label
            key={goal.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              selected.includes(goal.value)
                ? "border-[#7a9a65] bg-[#7a9a65]/5"
                : "border-border hover:border-[#7a9a65]/40"
            }`}
          >
            <Checkbox
              checked={selected.includes(goal.value)}
              onCheckedChange={() => toggle(goal.value)}
            />
            <span className="text-sm font-medium text-heading">{goal.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

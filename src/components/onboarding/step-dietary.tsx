"use client";

import { Leaf } from "lucide-react";
import { Checkbox } from "@cookest/ui";
import { DIETARY_OPTIONS_FULL } from "@/lib/constants";

interface StepDietaryProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function StepDietary({ selected, onChange }: StepDietaryProps) {
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
        <Leaf className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
        <h2 className="font-serif text-xl font-semibold text-heading">
          Any dietary restrictions?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Select all that apply. You can change these later.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {DIETARY_OPTIONS_FULL.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              selected.includes(opt.value)
                ? "border-[#7a9a65] bg-[#7a9a65]/5"
                : "border-border hover:border-[#7a9a65]/40"
            }`}
          >
            <Checkbox
              checked={selected.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            <span className="text-sm font-medium text-heading">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

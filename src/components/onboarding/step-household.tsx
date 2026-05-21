"use client";

import { Users } from "lucide-react";
import { Input } from "@cookest/ui";

interface StepHouseholdProps {
  value: number;
  onChange: (value: number) => void;
}

export function StepHousehold({ value, onChange }: StepHouseholdProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
        <h2 className="font-serif text-xl font-semibold text-heading">
          How many people are in your household?
        </h2>
        <p className="mt-1 text-sm text-muted">
          This helps us adjust recipe servings and meal plans.
        </p>
      </div>
      <div className="mx-auto max-w-xs">
        <Input
          type="number"
          min={1}
          max={20}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="text-center text-2xl"
        />
      </div>
    </div>
  );
}

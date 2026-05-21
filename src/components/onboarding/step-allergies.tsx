"use client";

import { AlertTriangle, Check } from "lucide-react";
import { Badge } from "@cookest/ui";

const ALLERGY_SUGGESTIONS = [
  "nuts",
  "shellfish",
  "dairy",
  "eggs",
  "soy",
  "wheat",
  "fish",
] as const;

interface StepAllergiesProps {
  allergies: string[];
  onChange: (allergies: string[]) => void;
}

export function StepAllergies({ allergies, onChange }: StepAllergiesProps) {
  function toggle(value: string) {
    onChange(
      allergies.includes(value)
        ? allergies.filter((v) => v !== value)
        : [...allergies, value]
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
        <h2 className="font-serif text-xl font-semibold text-heading">
          Do you have any allergies?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Tap to add or remove. We&apos;ll filter out recipes with these ingredients.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {ALLERGY_SUGGESTIONS.map((allergy) => {
          const isSelected = allergies.includes(allergy);
          return (
            <button
              key={allergy}
              type="button"
              onClick={() => toggle(allergy)}
              className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                isSelected
                  ? "border-[#7a9a65] bg-[#7a9a65] text-white"
                  : "border-border bg-surface text-muted hover:border-[#7a9a65]/40 hover:text-heading"
              }`}
            >
              {isSelected && <Check className="mr-1 inline h-3.5 w-3.5" />}
              {allergy}
            </button>
          );
        })}
      </div>
      {allergies.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {allergies.map((a) => (
            <Badge key={a} className="bg-red-100 text-red-800 capitalize">
              {a}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { ChefHat, Check } from "lucide-react";

const SKILL_CARDS = [
  {
    value: "beginner" as const,
    label: "Beginner",
    description: "I'm new to cooking and prefer simple recipes with basic techniques.",
    icon: "🥄",
  },
  {
    value: "intermediate" as const,
    label: "Intermediate",
    description: "I'm comfortable in the kitchen and can follow most recipes.",
    icon: "🍳",
  },
  {
    value: "advanced" as const,
    label: "Advanced",
    description: "I love challenging recipes and experimenting with complex techniques.",
    icon: "👨‍🍳",
  },
] as const;

interface StepSkillProps {
  selected: "beginner" | "intermediate" | "advanced";
  onChange: (value: "beginner" | "intermediate" | "advanced") => void;
}

export function StepSkill({ selected, onChange }: StepSkillProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <ChefHat className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
        <h2 className="font-serif text-xl font-semibold text-heading">
          What&apos;s your cooking skill level?
        </h2>
        <p className="mt-1 text-sm text-muted">
          This helps us recommend the right recipes for you.
        </p>
      </div>
      <div className="grid gap-4">
        {SKILL_CARDS.map((skill) => (
          <button
            key={skill.value}
            type="button"
            onClick={() => onChange(skill.value)}
            className={`flex items-center gap-4 rounded-lg border p-5 text-left transition-colors ${
              selected === skill.value
                ? "border-[#7a9a65] bg-[#7a9a65]/5 ring-2 ring-[#7a9a65]/20"
                : "border-border hover:border-[#7a9a65]/40"
            }`}
          >
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <h3 className="font-semibold text-heading">{skill.label}</h3>
              <p className="text-sm text-muted">{skill.description}</p>
            </div>
            {selected === skill.value && (
              <Check className="ml-auto h-5 w-5 shrink-0 text-[#7a9a65]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

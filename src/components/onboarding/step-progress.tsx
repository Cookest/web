"use client";

import {
  Users,
  Leaf,
  AlertTriangle,
  Target,
  ChefHat,
  Check,
} from "lucide-react";
import { Progress } from "@cookest/ui";

const TOTAL_STEPS = 5;

const STEP_INFO = [
  { icon: Users, label: "Household" },
  { icon: Leaf, label: "Dietary" },
  { icon: AlertTriangle, label: "Allergies" },
  { icon: Target, label: "Goals" },
  { icon: ChefHat, label: "Skill" },
] as const;

interface StepProgressProps {
  step: number;
}

export function StepProgress({ step }: StepProgressProps) {
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-heading">
          Welcome to Cookest
        </h1>
        <span className="text-sm text-muted">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        {STEP_INFO.map((s, i) => {
          const Icon = s.icon;
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;
          return (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-1 ${
                isActive
                  ? "text-[#7a9a65]"
                  : isDone
                    ? "text-[#7a9a65]/60"
                    : "text-muted/40"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-[#7a9a65] text-white"
                    : isDone
                      ? "bg-[#7a9a65]/20 text-[#7a9a65]"
                      : "bg-border text-muted"
                }`}
              >
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span className="hidden text-xs sm:block">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

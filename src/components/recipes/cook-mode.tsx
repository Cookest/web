"use client";

import { ChefHat, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@cookest/ui";
import type { Recipe } from "@/lib/types";

interface CookModeProps {
  recipe: Recipe;
  currentStep: number;
  onStepChange: (step: number) => void;
  onExit: () => void;
  onFinish: () => void;
}

export function CookMode({
  recipe,
  currentStep,
  onStepChange,
  onExit,
  onFinish,
}: CookModeProps) {
  const step = recipe.steps[currentStep];
  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f0]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
        <div className="flex items-center gap-3">
          <ChefHat className="h-5 w-5 text-[#7a9a65]" />
          <span className="font-serif font-semibold text-heading">
            Cook Mode
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            Step {currentStep + 1} of {recipe.steps.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-border">
        <div
          className="h-full bg-[#7a9a65] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#7a9a65]/10 text-[#7a9a65]">
            <span className="text-2xl font-bold">{step.step_number}</span>
          </div>
          <p className="text-xl leading-relaxed text-heading sm:text-2xl">
            {step.instruction}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4">
        <Button
          variant="secondary"
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < recipe.steps.length - 1 ? (
          <Button
            onClick={() => onStepChange(currentStep + 1)}
            className="bg-[#7a9a65] hover:bg-[#6b8a56]"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onFinish}
            className="bg-[#7a9a65] hover:bg-[#6b8a56]"
          >
            <Check className="mr-2 h-4 w-4" />
            Finish Cooking
          </Button>
        )}
      </div>
    </div>
  );
}

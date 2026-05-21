"use client";

import { ChefHat } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What can I make with chicken?",
  "Plan a healthy week",
  "Substitute for butter",
  "Quick 15-min dinner ideas",
];

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function WelcomeScreen({ onSelectPrompt, disabled }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#7a9a65]/10 flex items-center justify-center">
          <ChefHat className="h-8 w-8 text-[#7a9a65]" />
        </div>
        <h1 className="text-2xl font-semibold text-[#1c3a2a] mb-2 font-[family-name:var(--font-heading)]">
          Ask me anything about cooking
        </h1>
        <p className="text-[#7a8e74] mb-8">
          I can help with recipes, meal planning, ingredient substitutions,
          and more.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              className="text-left rounded-xl border border-[#e4ebe0] bg-white px-4 py-3 text-sm text-[#1c3a2a] hover:border-[#7a9a65]/40 hover:bg-[#7a9a65]/5 transition-colors"
              onClick={() => onSelectPrompt(prompt)}
              disabled={disabled}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

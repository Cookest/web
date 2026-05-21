"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import type { UserPreferences } from "@/lib/types";

interface PreferencesSectionProps {
  preferences: UserPreferences;
  onReset: () => Promise<void>;
}

export function PreferencesSection({ preferences, onReset }: PreferencesSectionProps) {
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await onReset();
    } finally {
      setResetting(false);
    }
  }

  const hasCuisine = Object.keys(preferences.cuisine_weights).length > 0;
  const hasDifficulty = Object.keys(preferences.difficulty_weights).length > 0;
  const hasIngredient = Object.keys(preferences.ingredient_weights).length > 0;
  const hasAny = hasCuisine || hasDifficulty || hasIngredient;

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <RefreshCw className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Learned Preferences</h2>
        </div>

        <p className="text-sm text-muted">
          Cookest learns your taste preferences over time based on your ratings and interactions.
        </p>

        <div className="space-y-3">
          {hasCuisine && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-heading">Cuisine Preferences</h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(preferences.cuisine_weights)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([cuisine, weight]) => (
                    <Badge key={cuisine} className="bg-[#7a9a65]/10 text-[#7a9a65] capitalize">
                      {cuisine} ({(weight * 100).toFixed(0)}%)
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {hasDifficulty && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-heading">Difficulty Preferences</h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(preferences.difficulty_weights).map(([diff, weight]) => (
                  <Badge key={diff} className="bg-amber-100 text-amber-800 capitalize">
                    {diff} ({(weight * 100).toFixed(0)}%)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {hasIngredient && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-heading">Ingredient Preferences</h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(preferences.ingredient_weights)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 15)
                  .map(([ingredient, weight]) => (
                    <Badge key={ingredient} className="bg-blue-100 text-blue-800 capitalize">
                      {ingredient} ({(weight * 100).toFixed(0)}%)
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {!hasAny && (
            <p className="text-sm text-muted italic">
              No preferences learned yet. Rate some recipes to get started!
            </p>
          )}
        </div>

        <Button
          variant="secondary"
          onClick={handleReset}
          disabled={resetting}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
          {resetting ? "Resetting…" : "Reset Preferences"}
        </Button>
      </CardBody>
    </Card>
  );
}

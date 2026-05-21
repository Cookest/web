"use client";

import { Card, CardBody, Checkbox } from "@cookest/ui";
import type { Recipe } from "@/lib/types";

type Tab = "ingredients" | "instructions" | "nutrition";

function NutritionRow({
  label,
  value,
  unit,
  max,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-heading">{label}</span>
        <span className="text-muted">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

interface RecipeTabsProps {
  recipe: Recipe;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  checkedIngredients: Set<number>;
  onToggleIngredient: (idx: number) => void;
}

export function RecipeTabs({
  recipe,
  activeTab,
  onTabChange,
  checkedIngredients,
  onToggleIngredient,
}: RecipeTabsProps) {
  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {(["ingredients", "instructions", "nutrition"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "bg-[#7a9a65] text-white shadow-sm"
                : "text-muted hover:text-heading"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "ingredients" && (
        <Card>
          <CardBody className="divide-y divide-border p-0">
            {recipe.ingredients.map((ing, idx) => (
              <label
                key={ing.ingredient_id}
                className="flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors hover:bg-card"
              >
                <Checkbox
                  checked={checkedIngredients.has(idx)}
                  onCheckedChange={() => onToggleIngredient(idx)}
                />
                <span
                  className={`flex-1 text-sm ${
                    checkedIngredients.has(idx)
                      ? "text-muted line-through"
                      : "text-heading"
                  }`}
                >
                  {ing.name}
                </span>
                <span className="text-sm font-medium text-muted">
                  {ing.quantity} {ing.unit}
                </span>
              </label>
            ))}
          </CardBody>
        </Card>
      )}

      {activeTab === "instructions" && (
        <div className="space-y-4">
          {recipe.steps.map((step) => (
            <Card key={step.step_number}>
              <CardBody className="flex gap-4 p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7a9a65]/10 text-sm font-bold text-[#7a9a65]">
                  {step.step_number}
                </div>
                <p className="flex-1 leading-relaxed text-heading">
                  {step.instruction}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "nutrition" && recipe.nutrition && (
        <Card>
          <CardBody className="space-y-5 p-6">
            <h3 className="font-serif text-lg font-semibold text-heading">
              Nutrition Facts
            </h3>
            <p className="text-xs text-muted">Per serving</p>
            <NutritionRow
              label="Calories"
              value={recipe.nutrition.calories}
              unit=" kcal"
              max={800}
              color="bg-amber-500"
            />
            <NutritionRow
              label="Protein"
              value={recipe.nutrition.protein}
              unit="g"
              max={60}
              color="bg-red-500"
            />
            <NutritionRow
              label="Carbs"
              value={recipe.nutrition.carbs}
              unit="g"
              max={120}
              color="bg-blue-500"
            />
            <NutritionRow
              label="Fat"
              value={recipe.nutrition.fat}
              unit="g"
              max={80}
              color="bg-yellow-500"
            />
            <NutritionRow
              label="Fiber"
              value={recipe.nutrition.fiber}
              unit="g"
              max={40}
              color="bg-green-500"
            />
          </CardBody>
        </Card>
      )}
    </>
  );
}

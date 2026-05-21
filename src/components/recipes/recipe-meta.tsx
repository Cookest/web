"use client";

import { Clock, Users, ChefHat, Flame } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";
import type { Recipe } from "@/lib/types";

interface RecipeMetaProps {
  recipe: Recipe;
}

export function RecipeMeta({ recipe }: RecipeMetaProps) {
  const totalTime = recipe.prep_time + recipe.cook_time;

  const items = [
    { icon: Clock, label: "Prep", value: `${recipe.prep_time}m` },
    { icon: Clock, label: "Cook", value: `${recipe.cook_time}m` },
    { icon: Clock, label: "Total", value: `${totalTime}m` },
    { icon: Users, label: "Servings", value: `${recipe.servings}` },
    { icon: ChefHat, label: "Difficulty", value: recipe.difficulty },
    { icon: Flame, label: "Calories", value: `${recipe.calories}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {items.map((item) => (
        <Card key={item.label}>
          <CardBody className="flex flex-col items-center gap-1 p-3 text-center">
            <item.icon className="h-4 w-4 text-[#7a9a65]" />
            <span className="text-xs text-muted">{item.label}</span>
            <span className="text-sm font-semibold capitalize text-heading">
              {item.value}
            </span>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

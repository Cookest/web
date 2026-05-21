"use client";

import { RecipeCard } from "@/components/recipe-card";
import { RecipeCardSkeleton } from "@/components/skeletons";
import type { RecipeListItem } from "@/lib/types";

const PAGE_SIZE = 12;

interface RecipeGridProps {
  recipes: RecipeListItem[];
  onToggleFavourite: (id: string) => void;
  isLoading: boolean;
}

export function RecipeGrid({
  recipes,
  onToggleFavourite,
  isLoading,
}: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
}

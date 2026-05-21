"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Star, ChefHat } from "lucide-react";
import { Badge } from "@cookest/ui";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import type { Recipe } from "@/lib/types";

interface RecipeHeroProps {
  recipe: Recipe;
  onToggleFavourite: () => void;
}

export function RecipeHero({ recipe, onToggleFavourite }: RecipeHeroProps) {
  return (
    <div className="relative h-72 sm:h-96">
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#7a9a65] to-[#1c3a2a]">
          <ChefHat className="h-20 w-20 text-white/30" />
        </div>
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Back link */}
      <Link
        href="/recipes"
        className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <ArrowLeft className="h-5 w-5 text-white" />
      </Link>

      {/* Favourite */}
      <button
        type="button"
        onClick={onToggleFavourite}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <Heart
          className={`h-5 w-5 ${
            recipe.is_favourite
              ? "fill-red-500 text-red-500"
              : "text-white"
          }`}
        />
      </button>

      {/* Hero text */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge className="bg-[#7a9a65] text-white capitalize">
            {recipe.cuisine}
          </Badge>
          <Badge
            className={`${DIFFICULTY_COLORS[recipe.difficulty]} capitalize`}
          >
            {recipe.difficulty}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl">
          {recipe.title}
        </h1>
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-white">
            {recipe.rating_avg.toFixed(1)}
          </span>
          <span className="text-white/70">
            ({recipe.rating_count} ratings)
          </span>
        </div>
      </div>
    </div>
  );
}

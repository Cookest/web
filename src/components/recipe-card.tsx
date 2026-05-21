"use client";

import Link from "next/link";
import {
  Clock,
  Users,
  Flame,
  Star,
  Heart,
  UtensilsCrossed,
} from "lucide-react";
import { Card, CardBody, Badge } from "@cookest/ui";
import type { RecipeListItem } from "@/lib/types";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface RecipeCardProps {
  recipe: RecipeListItem;
  onToggleFavourite?: (id: string) => void;
  showFavourite?: boolean;
}

export function RecipeCard({
  recipe,
  onToggleFavourite,
  showFavourite = true,
}: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative h-48 bg-card">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#f0f4ec]">
              <UtensilsCrossed className="h-12 w-12 text-[#7a9a65]/40" />
            </div>
          )}
          {/* Favourite button */}
          {showFavourite && onToggleFavourite && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavourite(recipe.id);
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
            >
              <Heart
                className={`h-4 w-4 ${
                  recipe.is_favourite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500"
                }`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <CardBody className="space-y-3 p-4">
          <h3 className="font-serif text-lg font-semibold text-heading leading-tight line-clamp-1 group-hover:text-[#7a9a65] transition-colors">
            {recipe.title}
          </h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-[#7a9a65]/10 text-[#7a9a65] capitalize text-xs">
              {recipe.cuisine}
            </Badge>
            <Badge
              className={`${DIFFICULTY_COLORS[recipe.difficulty] || ""} text-xs capitalize`}
            >
              {recipe.difficulty}
            </Badge>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prep_time + recipe.cook_time}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {recipe.calories} cal
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-heading">
              {recipe.rating_avg.toFixed(1)}
            </span>
            <span className="text-muted">({recipe.rating_count})</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

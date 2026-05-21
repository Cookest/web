"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Clock, Users, Star, UtensilsCrossed } from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import { api } from "@/lib/api";
import type { RecipeListItem } from "@/lib/types";

const PAGE_SIZE = 12;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

function RecipeCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="h-48 bg-border" />
      <CardBody className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-border" />
          <div className="h-5 w-14 rounded-full bg-border" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 rounded bg-border" />
          <div className="h-4 w-16 rounded bg-border" />
        </div>
      </CardBody>
    </Card>
  );
}

function FavouriteRecipeCard({
  recipe,
  onToggleFavourite,
}: {
  recipe: RecipeListItem;
  onToggleFavourite: (id: string) => void;
}) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavourite(recipe.id);
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
          >
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </button>
        </div>

        <CardBody className="space-y-3 p-4">
          <h3 className="font-serif text-lg font-semibold text-heading leading-tight line-clamp-1 group-hover:text-[#7a9a65] transition-colors">
            {recipe.title}
          </h3>

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

          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prep_time + recipe.cook_time}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
          </div>

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

export default function FavouritesPage() {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["favourites", offset],
    queryFn: () => api.getFavourites(PAGE_SIZE, offset),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.toggleFavourite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
  });

  const recipes = data?.items || [];
  const total = data?.total || 0;
  const hasMore = offset + PAGE_SIZE < total;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-48 rounded bg-border animate-pulse" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500" />
        <h1 className="font-serif text-3xl font-bold text-heading">Favourites</h1>
        <Badge className="bg-[#7a9a65]/10 text-[#7a9a65]">{total} saved</Badge>
      </div>

      {/* Recipe Grid */}
      {recipes.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <FavouriteRecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavourite={(id) => toggleMutation.mutate(id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-3">
            {offset > 0 && (
              <Button
                variant="secondary"
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
              >
                Previous
              </Button>
            )}
            {hasMore && (
              <Button
                variant="secondary"
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Load More
              </Button>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f4ec]">
            <Heart className="h-10 w-10 text-[#7a9a65]/40" />
          </div>
          <h2 className="mb-2 font-serif text-xl font-semibold text-heading">
            No favourites yet
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted">
            Browse recipes and tap the heart icon to save your favourites here.
          </p>
          <Link href="/recipes">
            <Button className="bg-[#7a9a65] hover:bg-[#6b8a58] text-white">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Browse Recipes
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

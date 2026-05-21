"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button, Badge } from "@cookest/ui";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeCardSkeleton } from "@/components/skeletons";

const PAGE_SIZE = 12;

export default function FavouritesPage() {
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["favourites", offset],
    queryFn: () => api.getFavourites(PAGE_SIZE, offset),
  });
  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.toggleFavourite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favourites"] }),
  });
  const recipes = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasMore = offset + PAGE_SIZE < total;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-10 w-48 rounded bg-border animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Favourites"
        action={<Badge className="bg-[#7a9a65]/10 text-[#7a9a65]">{total} saved</Badge>} />
      {recipes.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe}
                onToggleFavourite={(id) => toggleMutation.mutate(id)} />
            ))}
          </div>
          <div className="flex justify-center gap-3">
            {offset > 0 && (
              <Button variant="secondary" onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
                Previous
              </Button>
            )}
            {hasMore && (
              <Button variant="secondary" onClick={() => setOffset(offset + PAGE_SIZE)}>
                Load More
              </Button>
            )}
          </div>
        </>
      ) : (
        <EmptyState icon={Heart} title="No favourites yet"
          description="Browse recipes and tap the heart icon to save your favourites here."
          action={{ label: "Browse Recipes", href: "/recipes" }} />
      )}
    </div>
  );
}

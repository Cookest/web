"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@cookest/ui";
import { api } from "@/lib/api";
import type { RecipeSearchParams } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RecipeFilters } from "@/components/recipes/recipe-filters";
import { RecipeGrid } from "@/components/recipes/recipe-grid";

const PAGE_SIZE = 12;

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const q = searchParams.get("q") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const dietary = searchParams.get("dietary") || "";
  const maxTime = searchParams.get("max_time") ? Number(searchParams.get("max_time")) : 0;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const [searchInput, setSearchInput] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const apiParams: RecipeSearchParams = {
    ...(q && { q }), ...(cuisine && { category: cuisine }),
    ...(difficulty && { difficulty }), ...(dietary && { dietary }),
    ...(maxTime && { max_time: maxTime }),
    limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", apiParams],
    queryFn: () => api.searchRecipes(apiParams),
  });
  const toggleFavourite = useMutation({
    mutationFn: (id: string) => api.toggleFavourite(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recipes"] }),
  });
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.delete("page");
      router.push(`/recipes?${params.toString()}`);
    },
    [router, searchParams]
  );
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <PageHeader title="Recipes" subtitle="Browse and discover recipes tailored to your taste." />
      <RecipeFilters
        searchInput={searchInput} onSearchInputChange={setSearchInput}
        onSearch={() => updateParams({ q: searchInput.trim() })}
        filtersOpen={filtersOpen} onToggleFilters={() => setFiltersOpen((v) => !v)}
        cuisine={cuisine} difficulty={difficulty} dietary={dietary} maxTime={maxTime}
        onUpdateParams={updateParams} onClearAll={() => router.push("/recipes")}
      />
      {isLoading || (data && data.items.length > 0) ? (
        <>
          {!isLoading && data && (
            <p className="text-sm text-muted">
              {data.total} recipe{data.total !== 1 ? "s" : ""} found
            </p>
          )}
          <RecipeGrid
            recipes={data?.items ?? []}
            onToggleFavourite={(id) => toggleFavourite.mutate(id)}
            isLoading={isLoading}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="secondary" size="sm" disabled={page <= 1}
                onClick={() => updateParams({ page: (page - 1).toString() })}>
                Previous
              </Button>
              <span className="px-4 text-sm text-muted">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages}
                onClick={() => updateParams({ page: (page + 1).toString() })}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={UtensilsCrossed} title="No recipes found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={{ label: "Clear all filters", onClick: () => router.push("/recipes") }}
        />
      )}
    </div>
  );
}

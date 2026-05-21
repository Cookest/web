"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Clock,
  Users,
  Flame,
  Star,
  Heart,
  Filter,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";
import { Button, Card, CardBody, Badge, Input } from "@cookest/ui";
import { api } from "@/lib/api";
import type { RecipeSearchParams, RecipeListItem } from "@/lib/types";

// ── Constants ──

const CUISINES = [
  "italian",
  "asian",
  "mediterranean",
  "mexican",
  "french",
  "indian",
  "american",
  "japanese",
] as const;

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

const DIETARY = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
] as const;

const TIME_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;

const PAGE_SIZE = 12;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

// ── Skeleton ──

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
          <div className="h-4 w-14 rounded bg-border" />
        </div>
      </CardBody>
    </Card>
  );
}

// ── Filter chip ──

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
        active
          ? "border-[#7a9a65] bg-[#7a9a65] text-white"
          : "border-border bg-surface text-muted hover:border-[#7a9a65]/40 hover:text-heading"
      }`}
    >
      {label}
    </button>
  );
}

// ── Recipe card ──

function RecipeCard({
  recipe,
  onToggleFavourite,
}: {
  recipe: RecipeListItem;
  onToggleFavourite: (id: string) => void;
}) {
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

// ── Main page ──

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read filters from URL
  const q = searchParams.get("q") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const dietary = searchParams.get("dietary") || "";
  const maxTime = searchParams.get("max_time")
    ? Number(searchParams.get("max_time"))
    : 0;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [searchInput, setSearchInput] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Build search params for API
  const apiParams: RecipeSearchParams = {
    ...(q && { q }),
    ...(cuisine && { category: cuisine }),
    ...(difficulty && { difficulty }),
    ...(dietary && { dietary }),
    ...(maxTime && { max_time: maxTime }),
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", apiParams],
    queryFn: () => api.searchRecipes(apiParams),
  });

  const toggleFavourite = useMutation({
    mutationFn: (id: string) => api.toggleFavourite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  // Update URL search params
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset to page 1 when filters change
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/recipes?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearch() {
    updateParams({ q: searchInput.trim() });
  }

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-heading sm:text-4xl">
          Recipes
        </h1>
        <p className="text-muted">
          Browse and discover recipes tailored to your taste.
        </p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search recipes..."
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button
          variant="secondary"
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          {/* Cuisine */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  active={cuisine === c}
                  onClick={() =>
                    updateParams({ cuisine: cuisine === c ? "" : c })
                  }
                />
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">
              Difficulty
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <FilterChip
                  key={d}
                  label={d}
                  active={difficulty === d}
                  onClick={() =>
                    updateParams({ difficulty: difficulty === d ? "" : d })
                  }
                />
              ))}
            </div>
          </div>

          {/* Dietary */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">Dietary</h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY.map((d) => (
                <FilterChip
                  key={d.value}
                  label={d.label}
                  active={dietary === d.value}
                  onClick={() =>
                    updateParams({ dietary: dietary === d.value ? "" : d.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* Max cooking time */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">
              Max Cooking Time
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <FilterChip
                  key={t.value}
                  label={t.label}
                  active={maxTime === t.value}
                  onClick={() =>
                    updateParams({
                      max_time:
                        maxTime === t.value ? "" : t.value.toString(),
                    })
                  }
                />
              ))}
            </div>
          </div>

          {/* Clear filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/recipes")}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Active filter badges */}
      {(cuisine || difficulty || dietary || maxTime > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Active filters:</span>
          {cuisine && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => updateParams({ cuisine: "" })}
            >
              {cuisine} ×
            </Badge>
          )}
          {difficulty && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => updateParams({ difficulty: "" })}
            >
              {difficulty} ×
            </Badge>
          )}
          {dietary && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => updateParams({ dietary: "" })}
            >
              {dietary.replace("_", " ")} ×
            </Badge>
          )}
          {maxTime > 0 && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65]"
              onClick={() => updateParams({ max_time: "" })}
            >
              ≤{maxTime}m ×
            </Badge>
          )}
        </div>
      )}

      {/* Recipe grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <p className="text-sm text-muted">
            {data.total} recipe{data.total !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onToggleFavourite={(id) => toggleFavourite.mutate(id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() =>
                  updateParams({ page: (page - 1).toString() })
                }
              >
                Previous
              </Button>
              <span className="px-4 text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  updateParams({ page: (page + 1).toString() })
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f4ec]">
            <UtensilsCrossed className="h-8 w-8 text-[#7a9a65]/50" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-heading">
            No recipes found
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
          <Button
            variant="secondary"
            className="mt-6"
            onClick={() => router.push("/recipes")}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Clock, BarChart2, Heart, X, Search } from "lucide-react";
import { Card, CardBody, Badge, Button, Input, Skeleton } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import type { RecipeListItem } from "@/lib/types";

const CATEGORIES = [
  "All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Soup", "Salad",
];
const DIFFICULTIES = ["Any", "easy", "medium", "hard"];

function RecipeCard({
  recipe,
  onLike,
  onSkip,
}: {
  recipe: RecipeListItem;
  onLike: () => void;
  onSkip: () => void;
}) {
  return (
    <Card className="overflow-hidden animate-fade-in">
      <CardBody className="p-0">
        <div className="h-52 bg-primary/10 flex items-center justify-center">
          <span className="text-6xl">🍽️</span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-heading font-serif flex-1 leading-tight">
              {recipe.title}
            </h2>
            {recipe.cuisine && (
              <Badge variant="default" size="sm">{recipe.cuisine}</Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted">
            {(recipe.prep_time + recipe.cook_time) > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.prep_time + recipe.cook_time} min
              </span>
            )}
            {recipe.difficulty && (
              <span className="flex items-center gap-1">
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="capitalize">{recipe.difficulty}</span>
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1 text-error border border-border hover:border-error"
              onClick={onSkip}
            >
              <X className="w-4 h-4" />
              Skip
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={onLike}
            >
              <Heart className="w-4 h-4" />
              Like
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function DiscoverPage() {
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("Any");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["discover", category, difficulty, debouncedSearch],
    queryFn: () =>
      api.searchRecipes({
        category: category === "All" ? undefined : category,
        difficulty: difficulty === "Any" ? undefined : difficulty,
        q: debouncedSearch || undefined,
        limit: 20,
      }),
  });

  const recipes = data?.items ?? [];
  const current = recipes[index];

  const handleLike = useCallback(async () => {
    if (!current) return;
    await api.toggleFavourite(current.id).catch(() => null);
    setIndex((i) => Math.min(i + 1, recipes.length - 1));
  }, [current, recipes.length]);

  const handleSkip = useCallback(() => {
    setIndex((i) => Math.min(i + 1, recipes.length - 1));
  }, [recipes.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleSkip();
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
      if (e.key === "Enter" || e.key === "l") handleLike();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleLike, handleSkip]);

  useEffect(() => {
    setIndex(0);
  }, [category, difficulty, debouncedSearch]);

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Discover"
        subtitle="Swipe through recipes — press Enter to like, arrows to navigate"
      />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                category === c
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex gap-1.5">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors capitalize ${
                  difficulty === d
                    ? "bg-primary/10 text-primary-dark border-primary/30"
                    : "border-border text-muted hover:border-primary/30"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <Input
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="max-w-sm mx-auto">
        {isLoading ? (
          <Card>
            <CardBody className="p-0">
              <Skeleton className="h-52 rounded-none rounded-t-xl" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardBody>
          </Card>
        ) : !current ? (
          <div className="text-center py-20 text-muted">
            <span className="text-5xl">🍽️</span>
            <p className="mt-3 font-medium">No recipes found</p>
            <p className="text-sm mt-1">Try different filters</p>
          </div>
        ) : (
          <div>
            <RecipeCard recipe={current} onLike={handleLike} onSkip={handleSkip} />
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                className="text-muted disabled:opacity-30 hover:text-heading transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-muted">
                {index + 1} / {recipes.length}
              </span>
              <button
                disabled={index >= recipes.length - 1}
                onClick={() => setIndex((i) => Math.min(i + 1, recipes.length - 1))}
                className="text-muted disabled:opacity-30 hover:text-heading transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

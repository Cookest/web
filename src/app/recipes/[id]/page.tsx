"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  Users,
  Flame,
  Star,
  Heart,
  ChefHat,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button, Card, CardBody, Badge, Checkbox, Progress } from "@cookest/ui";
import { api } from "@/lib/api";
import type { Recipe, RecipeNutrition } from "@/lib/types";

// ── Constants ──

type Tab = "ingredients" | "instructions" | "nutrition";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-red-100 text-red-800",
};

// ── Skeletons ──

function HeroSkeleton() {
  return (
    <div className="relative h-72 animate-pulse bg-border sm:h-96" />
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <HeroSkeleton />
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-border" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-24 rounded-lg bg-border" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Nutrition bar ──

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

// ── Star rating input ──

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Main page ──

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [cookMode, setCookMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => api.getRecipe(id),
    enabled: !!id,
  });

  const toggleFavourite = useMutation({
    mutationFn: () => api.toggleFavourite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });

  const markCooked = useMutation({
    mutationFn: () => api.cookRecipe(id, recipe?.servings ?? 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const rateRecipe = useMutation({
    mutationFn: (rating: number) => api.rateRecipe(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      setShowRating(false);
      setRatingValue(0);
    },
  });

  function toggleIngredient(idx: number) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  if (isLoading) return <DetailSkeleton />;
  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="font-serif text-2xl font-semibold text-heading">
          Recipe not found
        </h2>
        <Link href="/recipes">
          <Button variant="secondary" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </Link>
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  // ── Cook Mode ──
  if (cookMode) {
    const step = recipe.steps[currentStep];
    const progress = ((currentStep + 1) / recipe.steps.length) * 100;

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f0]">
        {/* Cook mode header */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-5 w-5 text-[#7a9a65]" />
            <span className="font-serif font-semibold text-heading">
              Cook Mode
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              Step {currentStep + 1} of {recipe.steps.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCookMode(false);
                setCurrentStep(0);
              }}
            >
              Exit
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-border">
          <div
            className="h-full bg-[#7a9a65] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#7a9a65]/10 text-[#7a9a65]">
              <span className="text-2xl font-bold">{step.step_number}</span>
            </div>
            <p className="text-xl leading-relaxed text-heading sm:text-2xl">
              {step.instruction}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < recipe.steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="bg-[#7a9a65] hover:bg-[#6b8a56]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => {
                setCookMode(false);
                setCurrentStep(0);
                markCooked.mutate();
              }}
              className="bg-[#7a9a65] hover:bg-[#6b8a56]"
            >
              <Check className="mr-2 h-4 w-4" />
              Finish Cooking
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Normal view ──
  return (
    <div className="mx-auto max-w-4xl pb-16">
      {/* Hero */}
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
          onClick={() => toggleFavourite.mutate()}
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
            <Badge className={`${DIFFICULTY_COLORS[recipe.difficulty]} capitalize`}>
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

      <div className="space-y-8 px-4 pt-6 sm:px-6">
        {/* Meta row */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { icon: Clock, label: "Prep", value: `${recipe.prep_time}m` },
            { icon: Clock, label: "Cook", value: `${recipe.cook_time}m` },
            { icon: Clock, label: "Total", value: `${totalTime}m` },
            { icon: Users, label: "Servings", value: `${recipe.servings}` },
            {
              icon: ChefHat,
              label: "Difficulty",
              value: recipe.difficulty,
            },
            { icon: Flame, label: "Calories", value: `${recipe.calories}` },
          ].map((item) => (
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

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {(["ingredients", "instructions", "nutrition"] as Tab[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[#7a9a65] text-white shadow-sm"
                    : "text-muted hover:text-heading"
                }`}
              >
                {tab}
              </button>
            )
          )}
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
                    onCheckedChange={() => toggleIngredient(idx)}
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setCookMode(true)}
            className="bg-[#7a9a65] hover:bg-[#6b8a56]"
          >
            <ChefHat className="mr-2 h-4 w-4" />
            Start Cooking
          </Button>
          <Button
            variant="secondary"
            onClick={() => markCooked.mutate()}
            disabled={markCooked.isPending}
          >
            <Check className="mr-2 h-4 w-4" />
            {markCooked.isPending ? "Saving…" : "Mark as Cooked"}
          </Button>
          <Button variant="secondary" onClick={() => setShowRating((v) => !v)}>
            <Star className="mr-2 h-4 w-4" />
            Rate Recipe
          </Button>
        </div>

        {/* Rating panel */}
        {showRating && (
          <Card>
            <CardBody className="flex flex-col items-center gap-4 p-6">
              <h3 className="font-serif text-lg font-semibold text-heading">
                Rate this recipe
              </h3>
              <StarRating
                value={ratingValue}
                onChange={setRatingValue}
              />
              <Button
                disabled={ratingValue === 0 || rateRecipe.isPending}
                onClick={() => rateRecipe.mutate(ratingValue)}
                className="bg-[#7a9a65] hover:bg-[#6b8a56]"
              >
                {rateRecipe.isPending ? "Submitting…" : "Submit Rating"}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChefHat, Check, Star, ArrowLeft } from "lucide-react";
import { Button, Card, CardBody } from "@cookest/ui";
import { api } from "@/lib/api";
import type { Recipe } from "@/lib/types";
import { DetailSkeleton } from "@/components/skeletons";
import { RecipeHero } from "@/components/recipes/recipe-hero";
import { RecipeMeta } from "@/components/recipes/recipe-meta";
import { RecipeTabs } from "@/components/recipes/recipe-tabs";
import { CookMode } from "@/components/recipes/cook-mode";

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="p-0.5">
          <Star className={`h-6 w-6 transition-colors ${
            star <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`} />
        </button>
      ))}
    </div>
  );
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "nutrition">("ingredients");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [cookMode, setCookMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [showRating, setShowRating] = useState(false);

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id], queryFn: () => api.getRecipe(id), enabled: !!id,
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
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }

  if (isLoading) return <DetailSkeleton />;
  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="font-serif text-2xl font-semibold text-heading">Recipe not found</h2>
        <Link href="/recipes">
          <Button variant="secondary" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Recipes
          </Button>
        </Link>
      </div>
    );
  }

  if (cookMode) {
    return (
      <CookMode recipe={recipe} currentStep={currentStep} onStepChange={setCurrentStep}
        onExit={() => { setCookMode(false); setCurrentStep(0); }}
        onFinish={() => { setCookMode(false); setCurrentStep(0); markCooked.mutate(); }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-16">
      <RecipeHero recipe={recipe} onToggleFavourite={() => toggleFavourite.mutate()} />
      <div className="space-y-8 px-4 pt-6 sm:px-6">
        <RecipeMeta recipe={recipe} />
        <RecipeTabs recipe={recipe} activeTab={activeTab} onTabChange={setActiveTab}
          checkedIngredients={checkedIngredients} onToggleIngredient={toggleIngredient} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setCookMode(true)} className="bg-[#7a9a65] hover:bg-[#6b8a56]">
            <ChefHat className="mr-2 h-4 w-4" />Start Cooking
          </Button>
          <Button variant="secondary" onClick={() => markCooked.mutate()} disabled={markCooked.isPending}>
            <Check className="mr-2 h-4 w-4" />{markCooked.isPending ? "Saving…" : "Mark as Cooked"}
          </Button>
          <Button variant="secondary" onClick={() => setShowRating((v) => !v)}>
            <Star className="mr-2 h-4 w-4" />Rate Recipe
          </Button>
        </div>
        {showRating && (
          <Card>
            <CardBody className="flex flex-col items-center gap-4 p-6">
              <h3 className="font-serif text-lg font-semibold text-heading">Rate this recipe</h3>
              <StarRating value={ratingValue} onChange={setRatingValue} />
              <Button disabled={ratingValue === 0 || rateRecipe.isPending}
                onClick={() => rateRecipe.mutate(ratingValue)} className="bg-[#7a9a65] hover:bg-[#6b8a56]">
                {rateRecipe.isPending ? "Submitting…" : "Submit Rating"}
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UtensilsCrossed, Plus, Lock, Globe } from "lucide-react";
import { Button } from "@cookest/ui";
import Link from "next/link";
import { api } from "@/lib/api";
import type { RecipeSearchParams } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { toast } from "sonner";

const PAGE_SIZE = 12;

export default function ManageRecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const apiParams: RecipeSearchParams = {
    limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", "mine", apiParams],
    queryFn: () => api.getMyRecipes(apiParams),
  });

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.delete("page");
      router.push(`/profile/recipes?${params.toString()}`);
    },
    [router, searchParams]
  );
  
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Manage Recipes" subtitle="View and manage recipes you have created." />
        <Link href="/recipes/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Recipe
          </Button>
        </Link>
      </div>
      
      {isLoading || (data && data.items.length > 0) ? (
        <div className="mt-8">
          {!isLoading && data && (
            <p className="mb-4 text-sm text-[var(--ck-text-muted)]">
              {data.total} recipe{data.total !== 1 ? "s" : ""} found
            </p>
          )}
          <RecipeGrid
            recipes={data?.items ?? []}
            onToggleFavourite={(id) => {}}
            isLoading={isLoading}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button variant="secondary" size="sm" disabled={page <= 1}
                onClick={() => updateParams({ page: (page - 1).toString() })}>
                Previous
              </Button>
              <span className="px-4 text-sm text-[var(--ck-text-muted)]">Page {page} of {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={page >= totalPages}
                onClick={() => updateParams({ page: (page + 1).toString() })}>
                Next
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState icon={UtensilsCrossed} title="No recipes yet"
            description="You haven't created any recipes yet."
            action={{ label: "Create a Recipe", onClick: () => router.push("/recipes/create") }}
          />
        </div>
      )}
    </div>
  );
}

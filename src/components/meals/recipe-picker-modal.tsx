"use client";

import { useState } from "react";
import { X, Search, Clock, Utensils } from "lucide-react";
import { Button, Card, Input, Tabs } from "@cookest/ui";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RecipeListItem } from "@/lib/types";

interface RecipePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipe: RecipeListItem) => void;
  isAdding?: boolean;
}

export function RecipePickerModal({
  open,
  onClose,
  onSelect,
  isAdding,
}: RecipePickerModalProps) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<"community" | "global">("community");

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", "search", source, search],
    queryFn: () => api.searchRecipes({ q: search, source, limit: 20 }),
    enabled: open,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full sm:max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-serif text-xl font-semibold text-heading">
            Select a Recipe
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-border transition-colors"
          >
            <X className="h-4 w-4 text-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <Tabs
            value={source}
            onChange={(val) => setSource(val as "community" | "global")}
            className="px-4"
            items={[
              { id: "global", label: "Global Recipes", content: null },
              { id: "community", label: "Browse Community", content: null }
            ]}
          />
        </div>
        
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted">Loading...</div>
          ) : data?.items?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted">No recipes found.</div>
          ) : (
            <div className="space-y-1">
              {data?.items?.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => onSelect(recipe)}
                  disabled={isAdding}
                  className="w-full flex items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/10 transition-colors disabled:opacity-50"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-[#f0f4ec] overflow-hidden">
                    {recipe.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={recipe.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Utensils className="h-5 w-5 text-[#7a9a65]/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate text-sm font-medium text-heading">
                      {recipe.title}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prep_time + recipe.cook_time}m
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Check, RefreshCw } from "lucide-react";
import { Button, Progress } from "@cookest/ui";
import { api } from "@/lib/api";
import type { ShoppingItem } from "@/lib/types";
import { ShoppingCategory } from "@/components/groceries/shopping-category";
import { AddItemForm } from "@/components/groceries/add-item-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const groups: Record<string, ShoppingItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-5 w-24 rounded bg-[var(--ck-border)]" />
          <div className="space-y-2 rounded-lg border border-border bg-surface p-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-[var(--ck-border)]" />
                <div className="h-4 w-40 rounded bg-[var(--ck-border)]" />
                <div className="ml-auto h-4 w-16 rounded bg-[var(--ck-border)]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GroceriesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["shopping-list"],
    queryFn: () => api.getShoppingList(),
  });

  const items = data?.items ?? [];
  const totalItems = data?.total_items ?? 0;
  const checkedItems = data?.checked_items ?? 0;
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const grouped = useMemo(() => groupByCategory(items), [items]);

  const addMutation = useMutation({
    mutationFn: (data: { ingredient_id: number; quantity: number; unit: string }) =>
      api.addShoppingItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.toggleShoppingItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteShoppingItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list"] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => api.clearCheckedItems(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list"] }),
  });

  const syncMutation = useMutation({
    mutationFn: () => api.syncShoppingList(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping-list"] }),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader 
          title="Groceries" 
          subtitle={`${checkedItems}/${totalItems} items checked`} 
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            Sync from Plan
          </Button>
          {checkedItems > 0 && (
            <Button
              variant="secondary"
              onClick={() => clearMutation.mutate()}
              disabled={clearMutation.isPending}
            >
              <Check className="mr-2 h-4 w-4" />
              Clear Checked
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {totalItems > 0 && (
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-[var(--ck-text-muted)]">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      <AddItemForm onAdd={(d) => addMutation.mutate(d)} isPending={addMutation.isPending} />

      {/* Content */}
      {isLoading ? (
        <ListSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your shopping list is empty"
          description="Add items manually or sync from your current meal plan to get started."
          action={{
            label: "Sync from Meal Plan",
            onClick: () => syncMutation.mutate(),
          }}
        />
      ) : (
        <div>
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <ShoppingCategory
              key={category}
              category={category}
              items={categoryItems}
              onToggle={(id) => toggleMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

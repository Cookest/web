"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  Badge,
  Checkbox,
  Progress,
  Input,
} from "@cookest/ui";
import { api } from "@/lib/api";
import type { ShoppingItem, ShoppingListResponse, Ingredient } from "@/lib/types";

// ── Helpers ──

function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const groups: Record<string, ShoppingItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(item);
  }
  // Sort categories alphabetically
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  meat: "bg-red-100 text-red-800",
  dairy: "bg-blue-100 text-blue-800",
  produce: "bg-green-100 text-green-800",
  grains: "bg-amber-100 text-amber-800",
  spices: "bg-orange-100 text-orange-800",
  beverages: "bg-purple-100 text-purple-800",
  frozen: "bg-cyan-100 text-cyan-800",
  snacks: "bg-pink-100 text-pink-800",
};

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] ?? "bg-gray-100 text-gray-800";
}

// ── Skeletons ──

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-5 w-24 rounded bg-[#e4ebe0]" />
          <div className="space-y-2 rounded-lg border border-[#e4ebe0] bg-[#fafaf6] p-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-4 rounded bg-[#e4ebe0]" />
                <div className="h-4 w-40 rounded bg-[#e4ebe0]" />
                <div className="ml-auto h-4 w-16 rounded bg-[#e4ebe0]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Ingredient Search (inline) ──

function InlineIngredientSearch({
  onSelect,
}: {
  onSelect: (ingredient: Ingredient) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: results = [] } = useQuery({
    queryKey: ["ingredients", query],
    queryFn: () => api.searchIngredients(query),
    enabled: query.length >= 2,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative flex-1" ref={ref}>
      <Input
        placeholder="Search ingredient..."
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[#e4ebe0] bg-white shadow-lg max-h-48 overflow-y-auto">
          {results.map((ing) => (
            <button
              key={ing.id}
              type="button"
              onClick={() => {
                onSelect(ing);
                setQuery("");
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-[#1c3a2a] hover:bg-[#f0f4ec] transition-colors"
            >
              {ing.name}
              {ing.category && (
                <span className="ml-2 text-xs text-[#7a8e74]">{ing.category}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add Item Form ──

function AddItemForm({ onAdd, isPending }: { onAdd: (data: { ingredient_id: number; quantity: number; unit: string }) => void; isPending: boolean }) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ingredient) return;
    onAdd({
      ingredient_id: ingredient.id,
      quantity: parseFloat(quantity) || 1,
      unit: unit || "pcs",
    });
    setIngredient(null);
    setQuantity("");
    setUnit("");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {ingredient ? (
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-[#e4ebe0] bg-[#f0f4ec] px-3 py-2">
                <span className="text-sm font-medium text-[#1c3a2a]">{ingredient.name}</span>
                <button
                  type="button"
                  onClick={() => setIngredient(null)}
                  className="ml-auto text-[#7a8e74] hover:text-[#1c3a2a]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <InlineIngredientSearch onSelect={setIngredient} />
            )}
            <div className="w-24">
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="Qty"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Input
                placeholder="Unit"
                value={unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={!ingredient || isPending}>
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}

// ── Category Group ──

function CategoryGroup({
  category,
  items,
  onToggle,
  onDelete,
}: {
  category: string;
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const checkedCount = items.filter((i) => i.is_checked).length;

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="mb-2 flex w-full items-center gap-2 text-left"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-[#7a8e74]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#7a8e74]" />
        )}
        <Badge className={`text-xs capitalize ${getCategoryColor(category)}`}>
          {category}
        </Badge>
        <span className="text-xs text-[#7a8e74]">
          {checkedCount}/{items.length}
        </span>
      </button>

      {!collapsed && (
        <Card>
          <CardBody className="divide-y divide-[#e4ebe0] p-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#fafaf6]"
              >
                <Checkbox
                  checked={item.is_checked}
                  onCheckedChange={() => onToggle(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm ${
                      item.is_checked
                        ? "text-[#7a8e74] line-through"
                        : "font-medium text-[#1c3a2a]"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="ml-2 text-xs text-[#7a8e74]">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded p-1 text-[#7a8e74] opacity-0 transition-opacity hover:bg-red-50 hover:text-[#f44336] group-hover:opacity-100 [div:hover>&]:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

// ── Main Page ──

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1c3a2a]">Groceries</h1>
          <p className="mt-1 text-sm text-[#7a8e74]">
            {checkedItems}/{totalItems} items checked
          </p>
        </div>
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
        <div className="mb-6">
          <div className="mb-1 flex items-center justify-between text-xs text-[#7a8e74]">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}

      {/* Add item form */}
      <AddItemForm onAdd={(d) => addMutation.mutate(d)} isPending={addMutation.isPending} />

      {/* Content */}
      {isLoading ? (
        <ListSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="mb-4 h-16 w-16 text-[#e4ebe0]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c3a2a]">
            Your shopping list is empty
          </h2>
          <p className="mt-2 max-w-sm text-sm text-[#7a8e74]">
            Add items manually or sync from your current meal plan to get started.
          </p>
          <Button
            className="mt-4"
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            Sync from Meal Plan
          </Button>
        </div>
      ) : (
        <div>
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <CategoryGroup
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

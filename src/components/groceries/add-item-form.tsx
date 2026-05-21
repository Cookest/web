"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, Card, CardBody, Input } from "@cookest/ui";
import { IngredientSearch } from "@/components/ingredient-search";
import type { Ingredient } from "@/lib/types";

interface AddItemFormProps {
  onAdd: (data: { ingredient_id: number; quantity: number; unit: string }) => void;
  isPending: boolean;
}

export function AddItemForm({ onAdd, isPending }: AddItemFormProps) {
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
              <IngredientSearch onSelect={setIngredient} />
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

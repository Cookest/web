"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button, Input } from "@cookest/ui";
import { IngredientSearch } from "@/components/ingredient-search";
import type { InventoryItem, AddInventoryRequest, Ingredient } from "@/lib/types";

interface InventoryModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (data: AddInventoryRequest) => void;
  isPending: boolean;
}

export function InventoryModal({
  item,
  onClose,
  onSave,
  isPending,
}: InventoryModalProps) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(
    item ? { id: item.ingredient_id, name: item.name } as Ingredient : null
  );
  const [quantity, setQuantity] = useState(item?.quantity?.toString() ?? "");
  const [unit, setUnit] = useState(item?.unit ?? "");
  const [location, setLocation] = useState<AddInventoryRequest["location"]>(
    item?.location ?? "fridge"
  );
  const [expiryDate, setExpiryDate] = useState(item?.expiry_date?.split("T")[0] ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ingredient) return;
    onSave({
      ingredient_id: ingredient.id,
      quantity: parseFloat(quantity) || 0,
      unit,
      location,
      expiry_date: expiryDate || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl border border-[var(--ck-border)] bg-[var(--ck-surface)] p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[var(--ck-heading)]">
            {item ? "Edit Item" : "Add Item"}
          </h3>
          <button type="button" onClick={onClose} className="text-[var(--ck-text-muted)] hover:text-[var(--ck-heading)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ck-heading)]">Ingredient</label>
            <IngredientSearch onSelect={setIngredient} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--ck-heading)]">Quantity</label>
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--ck-heading)]">Unit</label>
              <Input
                placeholder="g, ml, pcs..."
                value={unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ck-heading)]">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as AddInventoryRequest["location"])}
              className="w-full rounded-lg border border-[var(--ck-border)] bg-[var(--ck-surface)] px-3 py-2 text-sm text-[var(--ck-heading)] focus:border-[var(--ck-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ck-primary)]"
            >
              <option value="fridge">Fridge</option>
              <option value="freezer">Freezer</option>
              <option value="pantry">Pantry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--ck-heading)]">Expiry Date</label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!ingredient || isPending}>
              {isPending ? "Saving..." : item ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Card, CardBody, Badge, Checkbox } from "@cookest/ui";
import type { ShoppingItem } from "@/lib/types";

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

interface ShoppingCategoryProps {
  category: string;
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingCategory({
  category,
  items,
  onToggle,
  onDelete,
}: ShoppingCategoryProps) {
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
          <ChevronRight className="h-4 w-4 text-[var(--ck-text-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--ck-text-muted)]" />
        )}
        <Badge className={`text-xs capitalize ${getCategoryColor(category)}`}>
          {category}
        </Badge>
        <span className="text-xs text-[var(--ck-text-muted)]">
          {checkedCount}/{items.length}
        </span>
      </button>

      {!collapsed && (
        <Card>
          <CardBody className="divide-y divide-border p-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted"
              >
                <Checkbox
                  checked={item.is_checked}
                  onCheckedChange={() => onToggle(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-sm ${
                      item.is_checked
                        ? "text-[var(--ck-text-muted)] line-through"
                        : "font-medium text-[var(--ck-heading)]"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="ml-2 text-xs text-[var(--ck-text-muted)]">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="rounded p-1 text-[var(--ck-text-muted)] opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 [div:hover>&]:opacity-100"
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

"use client";

import { Pencil, Trash2, Snowflake, Package, Refrigerator } from "lucide-react";
import { Card, CardBody, Badge } from "@cookest/ui";
import type { InventoryItem } from "@/lib/types";

const LOCATION_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Refrigerator }
> = {
  fridge: { label: "Fridge", color: "bg-blue-100 text-blue-800", icon: Refrigerator },
  freezer: { label: "Freezer", color: "bg-cyan-100 text-cyan-800", icon: Snowflake },
  pantry: { label: "Pantry", color: "bg-amber-100 text-amber-800", icon: Package },
  other: { label: "Other", color: "bg-gray-100 text-gray-800", icon: Package },
};

function getExpiryStatus(expiryDate: string | null): "ok" | "soon" | "expired" | null {
  if (!expiryDate) return null;
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "soon";
  return "ok";
}

function formatExpiryDate(date: string | null): string {
  if (!date) return "No expiry";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const EXPIRY_COLORS: Record<string, string> = {
  ok: "text-[#4caf50]",
  soon: "text-[#ff9800]",
  expired: "text-[#f44336]",
};

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: () => void;
  onDelete: () => void;
}

export function InventoryCard({ item, onEdit, onDelete }: InventoryCardProps) {
  const loc = LOCATION_CONFIG[item.location] ?? LOCATION_CONFIG.other;
  const expiryStatus = getExpiryStatus(item.expiry_date);
  const LocationIcon = loc.icon;

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardBody className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-[#1c3a2a] leading-tight">{item.name}</h3>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={onEdit}
              className="rounded p-1 text-[#7a8e74] hover:bg-[#f0f4ec] hover:text-[#1c3a2a]"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded p-1 text-[#7a8e74] hover:bg-red-50 hover:text-[#f44336]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="mb-3 text-sm text-[#7a8e74]">
          {item.quantity} {item.unit}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`text-xs ${loc.color}`}>
            <LocationIcon className="mr-1 h-3 w-3" />
            {loc.label}
          </Badge>

          {expiryStatus && (
            <span className={`text-xs font-medium ${EXPIRY_COLORS[expiryStatus]}`}>
              {expiryStatus === "expired" ? "Expired" : formatExpiryDate(item.expiry_date)}
            </span>
          )}
          {!expiryStatus && item.expiry_date === null && (
            <span className="text-xs text-[#7a8e74]">No expiry</span>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

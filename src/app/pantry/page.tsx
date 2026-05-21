"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Refrigerator,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  Snowflake,
  Package,
  X,
} from "lucide-react";
import { Button, Card, CardBody, Badge, Input } from "@cookest/ui";
import { api } from "@/lib/api";
import type {
  InventoryItem,
  InventoryResponse,
  AddInventoryRequest,
  Ingredient,
} from "@/lib/types";

// ── Constants ──

const LOCATION_TABS = ["all", "fridge", "freezer", "pantry", "expiring"] as const;
type LocationTab = (typeof LOCATION_TABS)[number];

const LOCATION_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Refrigerator }
> = {
  fridge: { label: "Fridge", color: "bg-blue-100 text-blue-800", icon: Refrigerator },
  freezer: { label: "Freezer", color: "bg-cyan-100 text-cyan-800", icon: Snowflake },
  pantry: { label: "Pantry", color: "bg-amber-100 text-amber-800", icon: Package },
  other: { label: "Other", color: "bg-gray-100 text-gray-800", icon: Package },
};

const TAB_LABELS: Record<LocationTab, string> = {
  all: "All",
  fridge: "Fridge",
  freezer: "Freezer",
  pantry: "Pantry",
  expiring: "Expiring Soon",
};

// ── Helpers ──

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

// ── Skeletons ──

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-[#e4ebe0] bg-[#fafaf6] p-4 space-y-3">
      <div className="h-5 w-3/4 rounded bg-[#e4ebe0]" />
      <div className="h-4 w-1/2 rounded bg-[#e4ebe0]" />
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-[#e4ebe0]" />
        <div className="h-5 w-20 rounded-full bg-[#e4ebe0]" />
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Ingredient Search ──

function IngredientSearch({
  value,
  onSelect,
}: {
  value: Ingredient | null;
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
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8e74]" />
        <Input
          placeholder="Search ingredient..."
          value={value ? value.name : query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (value) onSelect(null as unknown as Ingredient);
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className="pl-10"
        />
      </div>
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

// ── Add/Edit Modal ──

function ItemModal({
  item,
  onClose,
  onSave,
  isPending,
}: {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (data: AddInventoryRequest) => void;
  isPending: boolean;
}) {
  const [ingredient, setIngredient] = useState<Ingredient | null>(
    item ? { id: item.ingredient_id, name: item.name } : null
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
      <div className="w-full max-w-md rounded-xl border border-[#e4ebe0] bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[#1c3a2a]">
            {item ? "Edit Item" : "Add Item"}
          </h3>
          <button type="button" onClick={onClose} className="text-[#7a8e74] hover:text-[#1c3a2a]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c3a2a]">Ingredient</label>
            <IngredientSearch value={ingredient} onSelect={setIngredient} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1c3a2a]">Quantity</label>
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
              <label className="mb-1 block text-sm font-medium text-[#1c3a2a]">Unit</label>
              <Input
                placeholder="g, ml, pcs..."
                value={unit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c3a2a]">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value as AddInventoryRequest["location"])}
              className="w-full rounded-lg border border-[#e4ebe0] bg-white px-3 py-2 text-sm text-[#1c3a2a] focus:border-[#7a9a65] focus:outline-none focus:ring-1 focus:ring-[#7a9a65]"
            >
              <option value="fridge">Fridge</option>
              <option value="freezer">Freezer</option>
              <option value="pantry">Pantry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c3a2a]">Expiry Date</label>
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

// ── Inventory Card ──

function InventoryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: InventoryItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
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

// ── Main Page ──

export default function PantryPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<LocationTab>("all");
  const [modalItem, setModalItem] = useState<InventoryItem | null | "new">(null);

  const isExpiring = activeTab === "expiring";
  const locationFilter = activeTab !== "all" && activeTab !== "expiring" ? activeTab : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", isExpiring, locationFilter],
    queryFn: () => api.getInventory(isExpiring || undefined, locationFilter),
  });

  const items = data?.items ?? [];
  const expiringCount = data?.expiring_count ?? 0;

  const addMutation = useMutation({
    mutationFn: (data: AddInventoryRequest) => api.addInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setModalItem(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddInventoryRequest> }) =>
      api.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setModalItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteInventoryItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  function handleSave(formData: AddInventoryRequest) {
    if (modalItem && modalItem !== "new") {
      updateMutation.mutate({ id: (modalItem as InventoryItem).id, data: formData });
    } else {
      addMutation.mutate(formData);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Expiring banner */}
      {expiringCount > 0 && activeTab !== "expiring" && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#ff9800]/30 bg-[#ff9800]/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-[#ff9800]" />
          <p className="text-sm text-[#1c3a2a]">
            <span className="font-medium">{expiringCount} item{expiringCount !== 1 ? "s" : ""}</span>{" "}
            expiring soon.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("expiring")}
            className="ml-auto text-sm font-medium text-[#ff9800] hover:underline"
          >
            View
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1c3a2a]">Pantry</h1>
          <p className="mt-1 text-sm text-[#7a8e74]">
            {items.length} item{items.length !== 1 ? "s" : ""} in your inventory
          </p>
        </div>
        <Button onClick={() => setModalItem("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {LOCATION_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-[#7a9a65] text-white"
                : "bg-[#f0f4ec] text-[#1c3a2a] hover:bg-[#e4ebe0]"
            }`}
          >
            {TAB_LABELS[tab]}
            {tab === "expiring" && expiringCount > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ff9800] text-[10px] text-white">
                {expiringCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="mb-4 h-16 w-16 text-[#e4ebe0]" />
          <h2 className="font-serif text-xl font-semibold text-[#1c3a2a]">
            {activeTab === "expiring" ? "No items expiring soon" : "Your pantry is empty"}
          </h2>
          <p className="mt-2 text-sm text-[#7a8e74]">
            {activeTab === "expiring"
              ? "All your items are fresh!"
              : "Add items to keep track of what you have at home."}
          </p>
          {activeTab !== "expiring" && (
            <Button className="mt-4" onClick={() => setModalItem("new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <InventoryCard
              key={item.id}
              item={item}
              onEdit={() => setModalItem(item)}
              onDelete={() => deleteMutation.mutate(item.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalItem !== null && (
        <ItemModal
          item={modalItem === "new" ? null : modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleSave}
          isPending={addMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

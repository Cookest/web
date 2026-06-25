"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, AlertTriangle, Package } from "lucide-react";
import { Button } from "@cookest/ui";
import { api } from "@/lib/api";
import type { InventoryItem, AddInventoryRequest } from "@/lib/types";
import { InventoryCard } from "@/components/pantry/inventory-card";
import { InventoryModal } from "@/components/pantry/inventory-modal";
import { LocationTabs, type LocationTab } from "@/components/pantry/location-tabs";
import { EmptyState } from "@/components/empty-state";
import { GridSkeleton } from "@/components/skeletons";

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
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[color:color-mix(in_srgb,var(--ck-warning)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--ck-warning)_10%,transparent)] px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-[var(--ck-warning)]" />
          <p className="text-sm text-[var(--ck-heading)]">
            <span className="font-medium">{expiringCount} item{expiringCount !== 1 ? "s" : ""}</span>{" "}
            expiring soon.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("expiring")}
            className="ml-auto text-sm font-medium text-[var(--ck-warning)] hover:underline"
          >
            View
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--ck-heading)]">Pantry</h1>
          <p className="mt-1 text-sm text-[var(--ck-text-muted)]">
            {items.length} item{items.length !== 1 ? "s" : ""} in your inventory
          </p>
        </div>
        <Button onClick={() => setModalItem("new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <LocationTabs activeTab={activeTab} onTabChange={setActiveTab} expiringCount={expiringCount} />

      {/* Content */}
      {isLoading ? (
        <GridSkeleton cols={4} count={8} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={activeTab === "expiring" ? "No items expiring soon" : "Your pantry is empty"}
          description={
            activeTab === "expiring"
              ? "All your items are fresh!"
              : "Add items to keep track of what you have at home."
          }
          action={
            activeTab !== "expiring"
              ? { label: "Add Your First Item", onClick: () => setModalItem("new") }
              : undefined
          }
        />
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
        <InventoryModal
          item={modalItem === "new" ? null : modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleSave}
          isPending={addMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkles, RefreshCw } from "lucide-react";
import { Card, CardBody, Badge, Button, Skeleton, Alert, Spinner } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import type { WhatToBuyItem } from "@/lib/types";

function ItemCard({ item }: { item: WhatToBuyItem }) {
  const qty = item.amount != null && item.unit
    ? `${Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} ${item.unit}`
    : null;

  return (
    <Card>
      <CardBody>
        <div className="flex gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <span className="font-semibold text-heading flex-1">{item.item}</span>
              {item.nutrient && (
                <Badge variant="info" size="sm">{item.nutrient}</Badge>
              )}
            </div>
            <p className="text-sm text-muted mt-1 leading-relaxed">{item.reason}</p>
            {qty && (
              <p className="text-sm font-medium text-heading mt-2">{qty}</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function NutritionPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<WhatToBuyItem[]>({
    queryKey: ["what-to-buy"],
    queryFn: () => api.getWhatToBuy(""),
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="What to Buy"
          subtitle="AI-suggested groceries to fill nutritional gaps"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["what-to-buy"] })}
          disabled={isLoading}
          className="mt-1 flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted">
            <Spinner size="sm" />
            <span className="text-sm">Asking the AI…</span>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardBody>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="error">
          <span>Could not get suggestions. Please try again.</span>
        </Alert>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="text-center py-16 text-muted">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No suggestions right now.</p>
          <p className="text-sm mt-1">Check back after updating your pantry or meal plan.</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((item, i) => (
            <ItemCard key={`${item.item}-${i}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

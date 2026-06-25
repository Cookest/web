"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@cookest/ui";
import { api } from "@/lib/api";
import type { Ingredient } from "@/lib/types";

interface IngredientSearchProps {
  onSelect: (ingredient: Ingredient) => void;
  placeholder?: string;
}

export function IngredientSearch({
  onSelect,
  placeholder = "Search ingredient...",
}: IngredientSearchProps) {
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className="pl-10"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg max-h-48 overflow-y-auto">
          {results.map((ing) => (
            <button
              key={ing.id}
              type="button"
              onClick={() => {
                onSelect(ing);
                setQuery("");
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-heading hover:bg-primary/5 transition-colors"
            >
              {ing.name}
              {ing.category && (
                <span className="ml-2 text-xs text-muted">{ing.category}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

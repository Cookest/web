"use client";

import { Search, Filter, ChevronDown } from "lucide-react";
import { Button, Badge, Input } from "@cookest/ui";
import { CUISINES, DIFFICULTIES, DIETARY_OPTIONS } from "@/lib/constants";

const TIME_OPTIONS = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const;

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
        active
          ? "border-[#7a9a65] bg-[#7a9a65] text-white"
          : "border-border bg-surface text-muted hover:border-[#7a9a65]/40 hover:text-heading"
      }`}
    >
      {label}
    </button>
  );
}

interface RecipeFiltersProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearch: () => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  cuisine: string;
  difficulty: string;
  dietary: string;
  maxTime: number;
  onUpdateParams: (updates: Record<string, string>) => void;
  onClearAll: () => void;
}

export function RecipeFilters({
  searchInput,
  onSearchInputChange,
  onSearch,
  filtersOpen,
  onToggleFilters,
  cuisine,
  difficulty,
  dietary,
  maxTime,
  onUpdateParams,
  onClearAll,
}: RecipeFiltersProps) {
  return (
    <>
      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search recipes..."
            value={searchInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchInputChange(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") onSearch();
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={onSearch}>Search</Button>
        <Button
          variant="secondary"
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown
            className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      {/* Filters panel */}
      {filtersOpen && (
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">Cuisine</h3>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => (
                <FilterChip
                  key={c}
                  label={c}
                  active={cuisine === c}
                  onClick={() =>
                    onUpdateParams({ cuisine: cuisine === c ? "" : c })
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">
              Difficulty
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <FilterChip
                  key={d}
                  label={d}
                  active={difficulty === d}
                  onClick={() =>
                    onUpdateParams({ difficulty: difficulty === d ? "" : d })
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">Dietary</h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((d) => (
                <FilterChip
                  key={d.value}
                  label={d.label}
                  active={dietary === d.value}
                  onClick={() =>
                    onUpdateParams({
                      dietary: dietary === d.value ? "" : d.value,
                    })
                  }
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-heading">
              Max Cooking Time
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((t) => (
                <FilterChip
                  key={t.value}
                  label={t.label}
                  active={maxTime === t.value}
                  onClick={() =>
                    onUpdateParams({
                      max_time:
                        maxTime === t.value ? "" : t.value.toString(),
                    })
                  }
                />
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Active filter badges */}
      {(cuisine || difficulty || dietary || maxTime > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Active filters:</span>
          {cuisine && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => onUpdateParams({ cuisine: "" })}
            >
              {cuisine} ×
            </Badge>
          )}
          {difficulty && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => onUpdateParams({ difficulty: "" })}
            >
              {difficulty} ×
            </Badge>
          )}
          {dietary && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65] capitalize"
              onClick={() => onUpdateParams({ dietary: "" })}
            >
              {dietary.replace("_", " ")} ×
            </Badge>
          )}
          {maxTime > 0 && (
            <Badge
              className="cursor-pointer bg-[#7a9a65]/10 text-[#7a9a65]"
              onClick={() => onUpdateParams({ max_time: "" })}
            >
              ≤{maxTime}m ×
            </Badge>
          )}
        </div>
      )}
    </>
  );
}

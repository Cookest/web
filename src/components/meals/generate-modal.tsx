"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button, Card, CardBody, Checkbox, Input } from "@cookest/ui";
import { format, startOfWeek } from "date-fns";
import type { GenerateMealPlanRequest } from "@/lib/types";

const CUISINES = [
  "Italian",
  "Asian",
  "Mediterranean",
  "Mexican",
  "French",
  "Indian",
  "American",
  "Japanese",
] as const;

function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

interface GenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (data: GenerateMealPlanRequest) => void;
  isGenerating: boolean;
}

export function GenerateModal({
  open,
  onClose,
  onGenerate,
  isGenerating,
}: GenerateModalProps) {
  const [weekStart, setWeekStart] = useState(
    format(getWeekStart(new Date()), "yyyy-MM-dd")
  );
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [avoidRepeated, setAvoidRepeated] = useState(false);

  if (!open) return null;

  function handleCuisineToggle(cuisine: string) {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: GenerateMealPlanRequest = {
      week_start: weekStart,
      preferences: {
        max_prep_time: maxPrepTime ? Number(maxPrepTime) : undefined,
        cuisines: selectedCuisines.length > 0 ? selectedCuisines : undefined,
        avoid_repeated: avoidRepeated || undefined,
      },
    };
    onGenerate(data);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md">
        <CardBody className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-heading">
              Generate Meal Plan
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-border transition-colors"
            >
              <X className="h-4 w-4 text-muted" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Week start */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading">
                Week starting
              </label>
              <Input
                type="date"
                value={weekStart}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWeekStart(e.target.value)
                }
              />
            </div>

            {/* Max prep time */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-heading">
                Max prep time (minutes)
              </label>
              <Input
                type="number"
                placeholder="e.g. 45"
                value={maxPrepTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaxPrepTime(e.target.value)
                }
                min={0}
              />
            </div>

            {/* Cuisines */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-heading">
                Cuisine preferences
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CUISINES.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex items-center gap-2 text-sm text-heading cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedCuisines.includes(
                        cuisine.toLowerCase()
                      )}
                      onCheckedChange={() =>
                        handleCuisineToggle(cuisine.toLowerCase())
                      }
                    />
                    {cuisine}
                  </label>
                ))}
              </div>
            </div>

            {/* Avoid repeated */}
            <label className="flex items-center gap-2 text-sm text-heading cursor-pointer">
              <Checkbox
                checked={avoidRepeated}
                onCheckedChange={(checked: boolean) =>
                  setAvoidRepeated(checked)
                }
              />
              Avoid repeated recipes
            </label>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-[#7a9a65] text-white hover:bg-[#6b8a57]"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Generating…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Plan
                </span>
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

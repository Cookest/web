"use client";

import { useState } from "react";
import { Shield, Save } from "lucide-react";
import { Button, Card, CardBody, Input, Badge, Checkbox } from "@cookest/ui";
import { DIETARY_OPTIONS, HEALTH_GOALS } from "@/lib/constants";
import type { User } from "@/lib/types";

interface DietarySectionProps {
  profile: User;
  onSave: (data: {
    dietary_restrictions: string[];
    allergies: string[];
    health_goals: string[];
  }) => Promise<void>;
}

export function DietarySection({ profile, onSave }: DietarySectionProps) {
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    profile.dietary_restrictions || []
  );
  const [allergies, setAllergies] = useState<string[]>(profile.allergies || []);
  const [allergyInput, setAllergyInput] = useState("");
  const [healthGoals, setHealthGoals] = useState<string[]>(profile.health_goals || []);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function toggleDietary(value: string) {
    setDietaryRestrictions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleHealthGoal(value: string) {
    setHealthGoals((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function addAllergy() {
    const trimmed = allergyInput.trim().toLowerCase();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies((prev) => [...prev, trimmed]);
    }
    setAllergyInput("");
  }

  function removeAllergy(a: string) {
    setAllergies((prev) => prev.filter((v) => v !== a));
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      await onSave({
        dietary_restrictions: dietaryRestrictions,
        allergies,
        health_goals: healthGoals,
      });
      setMsg("Dietary preferences updated.");
    } catch {
      setMsg("Failed to update dietary preferences.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <Shield className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Dietary Preferences</h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-heading">Dietary Restrictions</label>
          <div className="flex flex-wrap gap-3">
            {DIETARY_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={dietaryRestrictions.includes(opt.value)}
                  onCheckedChange={() => toggleDietary(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-heading">Allergies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allergies.map((a) => (
              <Badge key={a} className="bg-red-100 text-red-800 capitalize flex items-center gap-1">
                {a}
                <button
                  type="button"
                  onClick={() => removeAllergy(a)}
                  className="ml-1 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={allergyInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAllergyInput(e.target.value)}
              placeholder="Add allergy…"
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllergy();
                }
              }}
            />
            <Button variant="secondary" onClick={addAllergy}>
              Add
            </Button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-heading">Health Goals</label>
          <div className="flex flex-wrap gap-3">
            {HEALTH_GOALS.map((g) => (
              <label key={g.value} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={healthGoals.includes(g.value)}
                  onCheckedChange={() => toggleHealthGoal(g.value)}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
            {msg}
          </p>
        )}

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Dietary Preferences"}
        </Button>
      </CardBody>
    </Card>
  );
}

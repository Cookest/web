"use client";

import { useState } from "react";
import { ChefHat, Save } from "lucide-react";
import { Button, Card, CardBody } from "@cookest/ui";
import { SKILL_LEVELS } from "@/lib/constants";

interface SkillSectionProps {
  currentSkill: string;
  onSave: (skill: string) => Promise<void>;
}

export function SkillSection({ currentSkill, onSave }: SkillSectionProps) {
  const [cookingSkill, setCookingSkill] = useState(currentSkill);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      await onSave(cookingSkill);
      setMsg("Cooking skill updated.");
    } catch {
      setMsg("Failed to update cooking skill.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <ChefHat className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Cooking Skill</h2>
        </div>

        <div className="flex flex-col gap-2">
          {SKILL_LEVELS.map((s) => (
            <label
              key={s.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                cookingSkill === s.value
                  ? "border-[#7a9a65] bg-[#7a9a65]/5"
                  : "border-border hover:border-[#7a9a65]/40"
              }`}
            >
              <input
                type="radio"
                name="cooking_skill"
                value={s.value}
                checked={cookingSkill === s.value}
                onChange={() => setCookingSkill(s.value)}
                className="accent-[#7a9a65]"
              />
              <span className="text-sm font-medium text-heading">{s.label}</span>
            </label>
          ))}
        </div>

        {msg && (
          <p className={`text-sm ${msg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
            {msg}
          </p>
        )}

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Skill Level"}
        </Button>
      </CardBody>
    </Card>
  );
}

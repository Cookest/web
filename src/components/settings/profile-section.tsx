"use client";

import { useState } from "react";
import { User, Save } from "lucide-react";
import { Button, Card, CardBody, Input } from "@cookest/ui";
import type { User as UserType } from "@/lib/types";

interface ProfileSectionProps {
  profile: UserType;
  onSave: (data: { name: string; household_size: number }) => Promise<void>;
}

export function ProfileSection({ profile, onSave }: ProfileSectionProps) {
  const [name, setName] = useState(profile.name);
  const [householdSize, setHouseholdSize] = useState(profile.household_size);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      await onSave({ name, household_size: householdSize });
      setMsg("Profile updated.");
    } catch {
      setMsg("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-heading">
          <User className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        <div className="text-sm text-muted">{profile.email}</div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-heading">Name</label>
            <Input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-heading">Household Size</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={householdSize}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
            {msg}
          </p>
        )}

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </CardBody>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Shield,
  Trash2,
  Key,
  RefreshCw,
  AlertTriangle,
  Save,
  ChefHat,
} from "lucide-react";
import { Button, Card, CardBody, Input, Badge, Checkbox } from "@cookest/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { User as UserType, UserPreferences } from "@/lib/types";

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
] as const;

const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const HEALTH_GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "heart_health", label: "Heart Health" },
  { value: "energy", label: "More Energy" },
  { value: "balanced", label: "Balanced Diet" },
] as const;

function SectionSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardBody className="space-y-4 p-6">
        <div className="h-6 w-1/3 rounded bg-border" />
        <div className="h-10 w-full rounded bg-border" />
        <div className="h-10 w-full rounded bg-border" />
      </CardBody>
    </Card>
  );
}

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserType | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Profile form
  const [name, setName] = useState("");
  const [householdSize, setHouseholdSize] = useState(1);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Dietary form
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [dietarySaving, setDietarySaving] = useState(false);
  const [dietaryMsg, setDietaryMsg] = useState("");

  // Cooking skill
  const [cookingSkill, setCookingSkill] = useState("beginner");
  const [skillSaving, setSkillSaving] = useState(false);
  const [skillMsg, setSkillMsg] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Preferences
  const [resettingPrefs, setResettingPrefs] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [p, prefs] = await Promise.all([
          api.getProfile(),
          api.getPreferences(),
        ]);
        setProfile(p);
        setPreferences(prefs);
        setName(p.name);
        setHouseholdSize(p.household_size);
        setDietaryRestrictions(p.dietary_restrictions || []);
        setAllergies(p.allergies || []);
        setHealthGoals(p.health_goals || []);
        setCookingSkill(p.cooking_skill || "beginner");
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await api.updateProfile({ name, household_size: householdSize });
      await refreshUser();
      setProfileMsg("Profile updated.");
    } catch {
      setProfileMsg("Failed to update profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleDietarySave() {
    setDietarySaving(true);
    setDietaryMsg("");
    try {
      await api.updateProfile({
        dietary_restrictions: dietaryRestrictions,
        allergies,
        health_goals: healthGoals,
      });
      await refreshUser();
      setDietaryMsg("Dietary preferences updated.");
    } catch {
      setDietaryMsg("Failed to update dietary preferences.");
    } finally {
      setDietarySaving(false);
    }
  }

  async function handleSkillSave() {
    setSkillSaving(true);
    setSkillMsg("");
    try {
      await api.updateProfile({ cooking_skill: cookingSkill });
      await refreshUser();
      setSkillMsg("Cooking skill updated.");
    } catch {
      setSkillMsg("Failed to update cooking skill.");
    } finally {
      setSkillSaving(false);
    }
  }

  async function handlePasswordChange() {
    setPasswordError("");
    setPasswordMsg("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setPasswordError("Failed to change password. Check your current password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await api.deleteAccount();
      window.location.href = "/login";
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  async function handleResetPreferences() {
    setResettingPrefs(true);
    try {
      await api.resetPreferences();
      setPreferences({ cuisine_weights: {}, difficulty_weights: {}, ingredient_weights: {} });
    } catch {
      // ignore
    } finally {
      setResettingPrefs(false);
    }
  }

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

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="h-10 w-48 rounded bg-border animate-pulse" />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-[#7a9a65]" />
        <h1 className="font-serif text-3xl font-bold text-heading">Settings</h1>
      </div>

      {/* Profile Section */}
      <Card>
        <CardBody className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-heading">
            <User className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>

          <div className="text-sm text-muted">
            {profile?.email}
          </div>

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

          {profileMsg && (
            <p className={`text-sm ${profileMsg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {profileMsg}
            </p>
          )}

          <Button onClick={handleProfileSave} disabled={profileSaving}>
            <Save className="mr-2 h-4 w-4" />
            {profileSaving ? "Saving…" : "Save Profile"}
          </Button>
        </CardBody>
      </Card>

      {/* Dietary Section */}
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

          {dietaryMsg && (
            <p className={`text-sm ${dietaryMsg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {dietaryMsg}
            </p>
          )}

          <Button onClick={handleDietarySave} disabled={dietarySaving}>
            <Save className="mr-2 h-4 w-4" />
            {dietarySaving ? "Saving…" : "Save Dietary Preferences"}
          </Button>
        </CardBody>
      </Card>

      {/* Cooking Skill */}
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

          {skillMsg && (
            <p className={`text-sm ${skillMsg.includes("Failed") ? "text-red-600" : "text-green-600"}`}>
              {skillMsg}
            </p>
          )}

          <Button onClick={handleSkillSave} disabled={skillSaving}>
            <Save className="mr-2 h-4 w-4" />
            {skillSaving ? "Saving…" : "Save Skill Level"}
          </Button>
        </CardBody>
      </Card>

      {/* Password Section */}
      <Card>
        <CardBody className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-heading">
            <Key className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">Current Password</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">New Password</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                placeholder="New password"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-heading">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordMsg && <p className="text-sm text-green-600">{passwordMsg}</p>}

          <Button onClick={handlePasswordChange} disabled={passwordSaving}>
            <Key className="mr-2 h-4 w-4" />
            {passwordSaving ? "Changing…" : "Change Password"}
          </Button>
        </CardBody>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardBody className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-heading">
            <RefreshCw className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Learned Preferences</h2>
          </div>

          <p className="text-sm text-muted">
            Cookest learns your taste preferences over time based on your ratings and interactions.
          </p>

          {preferences && (
            <div className="space-y-3">
              {Object.keys(preferences.cuisine_weights).length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-heading">Cuisine Preferences</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(preferences.cuisine_weights)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 10)
                      .map(([cuisine, weight]) => (
                        <Badge key={cuisine} className="bg-[#7a9a65]/10 text-[#7a9a65] capitalize">
                          {cuisine} ({(weight * 100).toFixed(0)}%)
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {Object.keys(preferences.difficulty_weights).length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-heading">Difficulty Preferences</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(preferences.difficulty_weights).map(([diff, weight]) => (
                      <Badge key={diff} className="bg-amber-100 text-amber-800 capitalize">
                        {diff} ({(weight * 100).toFixed(0)}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(preferences.ingredient_weights).length > 0 && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-heading">Ingredient Preferences</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(preferences.ingredient_weights)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 15)
                      .map(([ingredient, weight]) => (
                        <Badge key={ingredient} className="bg-blue-100 text-blue-800 capitalize">
                          {ingredient} ({(weight * 100).toFixed(0)}%)
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              {Object.keys(preferences.cuisine_weights).length === 0 &&
                Object.keys(preferences.difficulty_weights).length === 0 &&
                Object.keys(preferences.ingredient_weights).length === 0 && (
                  <p className="text-sm text-muted italic">
                    No preferences learned yet. Rate some recipes to get started!
                  </p>
                )}
            </div>
          )}

          <Button
            variant="secondary"
            onClick={handleResetPreferences}
            disabled={resettingPrefs}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${resettingPrefs ? "animate-spin" : ""}`} />
            {resettingPrefs ? "Resetting…" : "Reset Preferences"}
          </Button>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardBody className="space-y-4 p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Danger Zone</h2>
          </div>

          <p className="text-sm text-muted">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          {!showDeleteConfirm ? (
            <Button
              variant="secondary"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-800">
                Are you sure? This will permanently delete your account.
              </p>
              <div className="flex gap-2 ml-auto shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

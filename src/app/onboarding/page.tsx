"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Leaf,
  AlertTriangle,
  Target,
  ChefHat,
  Check,
  Sparkles,
} from "lucide-react";
import { Button, Card, CardBody, Badge, Checkbox, Input, Progress } from "@cookest/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const TOTAL_STEPS = 5;

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten Free" },
  { value: "dairy_free", label: "Dairy Free" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
] as const;

const ALLERGY_SUGGESTIONS = [
  "nuts",
  "shellfish",
  "dairy",
  "eggs",
  "soy",
  "wheat",
  "fish",
] as const;

const HEALTH_GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "heart_health", label: "Heart Health" },
  { value: "energy", label: "More Energy" },
  { value: "balanced", label: "Balanced Diet" },
] as const;

const SKILL_CARDS = [
  {
    value: "beginner" as const,
    label: "Beginner",
    description: "I'm new to cooking and prefer simple recipes with basic techniques.",
    icon: "🥄",
  },
  {
    value: "intermediate" as const,
    label: "Intermediate",
    description: "I'm comfortable in the kitchen and can follow most recipes.",
    icon: "🍳",
  },
  {
    value: "advanced" as const,
    label: "Advanced",
    description: "I love challenging recipes and experimenting with complex techniques.",
    icon: "👨‍🍳",
  },
] as const;

const STEP_INFO = [
  { icon: Users, label: "Household" },
  { icon: Leaf, label: "Dietary" },
  { icon: AlertTriangle, label: "Allergies" },
  { icon: Target, label: "Goals" },
  { icon: ChefHat, label: "Skill" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [householdSize, setHouseholdSize] = useState(2);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [cookingSkill, setCookingSkill] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  function toggleDietary(value: string) {
    setDietaryRestrictions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleAllergy(value: string) {
    setAllergies((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleHealthGoal(value: string) {
    setHealthGoals((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleNext() {
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  async function handleFinish() {
    setSubmitting(true);
    setError("");
    try {
      await api.onboarding({
        household_size: householdSize,
        dietary_restrictions: dietaryRestrictions,
        allergies,
        health_goals: healthGoals,
        cooking_skill: cookingSkill,
      });
      await refreshUser();
      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 py-10">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-heading">
            Welcome to Cookest
          </h1>
          <span className="text-sm text-muted">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {STEP_INFO.map((s, i) => {
            const Icon = s.icon;
            const stepNum = i + 1;
            const isActive = stepNum === step;
            const isDone = stepNum < step;
            return (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-1 ${
                  isActive
                    ? "text-[#7a9a65]"
                    : isDone
                      ? "text-[#7a9a65]/60"
                      : "text-muted/40"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-[#7a9a65] text-white"
                      : isDone
                        ? "bg-[#7a9a65]/20 text-[#7a9a65]"
                        : "bg-border text-muted"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden text-xs sm:block">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardBody className="p-8">
          {/* Step 1: Household Size */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
                <h2 className="font-serif text-xl font-semibold text-heading">
                  How many people are in your household?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  This helps us adjust recipe servings and meal plans.
                </p>
              </div>
              <div className="mx-auto max-w-xs">
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={householdSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="text-center text-2xl"
                />
              </div>
            </div>
          )}

          {/* Step 2: Dietary Restrictions */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Leaf className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
                <h2 className="font-serif text-xl font-semibold text-heading">
                  Any dietary restrictions?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Select all that apply. You can change these later.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {DIETARY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      dietaryRestrictions.includes(opt.value)
                        ? "border-[#7a9a65] bg-[#7a9a65]/5"
                        : "border-border hover:border-[#7a9a65]/40"
                    }`}
                  >
                    <Checkbox
                      checked={dietaryRestrictions.includes(opt.value)}
                      onCheckedChange={() => toggleDietary(opt.value)}
                    />
                    <span className="text-sm font-medium text-heading">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Allergies */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
                <h2 className="font-serif text-xl font-semibold text-heading">
                  Do you have any allergies?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Tap to add or remove. We&apos;ll filter out recipes with these ingredients.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {ALLERGY_SUGGESTIONS.map((allergy) => {
                  const isSelected = allergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                        isSelected
                          ? "border-[#7a9a65] bg-[#7a9a65] text-white"
                          : "border-border bg-surface text-muted hover:border-[#7a9a65]/40 hover:text-heading"
                      }`}
                    >
                      {isSelected && <Check className="mr-1 inline h-3.5 w-3.5" />}
                      {allergy}
                    </button>
                  );
                })}
              </div>
              {allergies.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {allergies.map((a) => (
                    <Badge key={a} className="bg-red-100 text-red-800 capitalize">
                      {a}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Health Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <Target className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
                <h2 className="font-serif text-xl font-semibold text-heading">
                  What are your health goals?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Select any that apply. We&apos;ll tailor meal suggestions.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {HEALTH_GOALS.map((goal) => (
                  <label
                    key={goal.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      healthGoals.includes(goal.value)
                        ? "border-[#7a9a65] bg-[#7a9a65]/5"
                        : "border-border hover:border-[#7a9a65]/40"
                    }`}
                  >
                    <Checkbox
                      checked={healthGoals.includes(goal.value)}
                      onCheckedChange={() => toggleHealthGoal(goal.value)}
                    />
                    <span className="text-sm font-medium text-heading">{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Cooking Skill */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <ChefHat className="mx-auto mb-3 h-12 w-12 text-[#7a9a65]" />
                <h2 className="font-serif text-xl font-semibold text-heading">
                  What&apos;s your cooking skill level?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  This helps us recommend the right recipes for you.
                </p>
              </div>
              <div className="grid gap-4">
                {SKILL_CARDS.map((skill) => (
                  <button
                    key={skill.value}
                    type="button"
                    onClick={() => setCookingSkill(skill.value)}
                    className={`flex items-center gap-4 rounded-lg border p-5 text-left transition-colors ${
                      cookingSkill === skill.value
                        ? "border-[#7a9a65] bg-[#7a9a65]/5 ring-2 ring-[#7a9a65]/20"
                        : "border-border hover:border-[#7a9a65]/40"
                    }`}
                  >
                    <span className="text-3xl">{skill.icon}</span>
                    <div>
                      <h3 className="font-semibold text-heading">{skill.label}</h3>
                      <p className="text-sm text-muted">{skill.description}</p>
                    </div>
                    {cookingSkill === skill.value && (
                      <Check className="ml-auto h-5 w-5 shrink-0 text-[#7a9a65]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Error */}
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={step === 1}
          className={step === 1 ? "invisible" : ""}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={handleNext}
            className="bg-[#7a9a65] hover:bg-[#6b8a58] text-white"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            disabled={submitting}
            className="bg-[#7a9a65] hover:bg-[#6b8a58] text-white"
          >
            {submitting ? (
              "Setting up…"
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Get Started
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

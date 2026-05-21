"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button, Card, CardBody } from "@cookest/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { StepProgress } from "@/components/onboarding/step-progress";
import { StepHousehold } from "@/components/onboarding/step-household";
import { StepDietary } from "@/components/onboarding/step-dietary";
import { StepAllergies } from "@/components/onboarding/step-allergies";
import { StepGoals } from "@/components/onboarding/step-goals";
import { StepSkill } from "@/components/onboarding/step-skill";

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [householdSize, setHouseholdSize] = useState(2);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState<string[]>([]);
  const [cookingSkill, setCookingSkill] = useState<"beginner" | "intermediate" | "advanced">("beginner");

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

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 py-10">
      <StepProgress step={step} />

      <Card>
        <CardBody className="p-8">
          {step === 1 && <StepHousehold value={householdSize} onChange={setHouseholdSize} />}
          {step === 2 && <StepDietary selected={dietaryRestrictions} onChange={setDietaryRestrictions} />}
          {step === 3 && <StepAllergies allergies={allergies} onChange={setAllergies} />}
          {step === 4 && <StepGoals selected={healthGoals} onChange={setHealthGoals} />}
          {step === 5 && <StepSkill selected={cookingSkill} onChange={setCookingSkill} />}
        </CardBody>
      </Card>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className={step === 1 ? "invisible" : ""}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
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

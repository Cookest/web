"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Card, CardBody } from "@cookest/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { User as UserType, UserPreferences } from "@/lib/types";
import { ProfileSection } from "@/components/settings/profile-section";
import { DietarySection } from "@/components/settings/dietary-section";
import { SkillSection } from "@/components/settings/skill-section";
import { PasswordSection } from "@/components/settings/password-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { DangerSection } from "@/components/settings/danger-section";

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
  const { refreshUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserType | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [p, prefs] = await Promise.all([
          api.getProfile(),
          api.getPreferences(),
        ]);
        setProfile(p);
        setPreferences(prefs);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

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
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-[#7a9a65]" />
        <h1 className="font-serif text-3xl font-bold text-heading">Settings</h1>
      </div>

      {profile && (
        <>
          <ProfileSection
            profile={profile}
            onSave={async (data) => {
              await api.updateProfile(data);
              await refreshUser();
            }}
          />

          <DietarySection
            profile={profile}
            onSave={async (data) => {
              await api.updateProfile(data);
              await refreshUser();
            }}
          />

          <SkillSection
            currentSkill={profile.cooking_skill || "beginner"}
            onSave={async (skill) => {
              await api.updateProfile({ cooking_skill: skill });
              await refreshUser();
            }}
          />
        </>
      )}

      <PasswordSection />

      {preferences && (
        <PreferencesSection
          preferences={preferences}
          onReset={async () => {
            await api.resetPreferences();
            setPreferences({ cuisine_weights: {}, difficulty_weights: {}, ingredient_weights: {} });
          }}
        />
      )}

      <DangerSection
        onDelete={async () => {
          await api.deleteAccount();
          window.location.href = "/login";
        }}
      />
    </div>
  );
}

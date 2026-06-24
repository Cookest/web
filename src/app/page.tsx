"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Refrigerator, AlertTriangle, Flame, Target } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { StatCard } from "@/components/stat-card";
import { StatCardSkeleton } from "@/components/skeletons";
import { PageHeader } from "@/components/page-header";
import { TodaysMeals } from "@/components/dashboard/todays-meals";
import { ExpiringItems } from "@/components/dashboard/expiring-items";
import { QuickActions } from "@/components/dashboard/quick-actions";

// Marketing landing page components
import TranslationProvider from "@/marketing/TranslationProvider";
import ThemeProvider from "@/marketing/ThemeProvider";
import Nav from "@/marketing/Nav";
import Hero from "@/marketing/Hero";
import Features from "@/marketing/Features";
import Showcase from "@/marketing/Showcase";
import ScrollStory from "@/marketing/ScrollStory";
import Sustainability from "@/marketing/Sustainability";
import Download from "@/marketing/Download";
import Footer from "@/marketing/Footer";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function Dashboard() {
  const { user } = useAuth();
  const today = new Date();

  const { data: inventory, isLoading: inventoryLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.getInventory(),
  });

  const { data: expiringSoon, isLoading: expiringLoading } = useQuery({
    queryKey: ["inventory", "expiring"],
    queryFn: () => api.getInventory(true),
  });

  const { data: mealPlan, isLoading: mealPlanLoading } = useQuery({
    queryKey: ["meal-plan", "current"],
    queryFn: () => api.getCurrentMealPlan(),
    retry: false,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["history", "week"],
    queryFn: () => api.getHistory(50, 0),
  });

  const cookedThisWeek = useMemo(() => {
    if (!history) return 0;
    const items = Array.isArray(history) ? history : (history as any).items || [];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return items.filter(
      (h: any) => h.cooked_at && new Date(h.cooked_at) >= weekStart
    ).length;
  }, [history]);

  const mealPlanCompletion = useMemo(() => {
    if (!mealPlan || mealPlan.slots.length === 0) return 0;
    const completed = mealPlan.slots.filter((s) => s.is_completed).length;
    return Math.round((completed / mealPlan.slots.length) * 100);
  }, [mealPlan]);

  const expiringItems = useMemo(() => {
    if (!expiringSoon) return [];
    return expiringSoon.items
      .filter((item) => item.expiry_date)
      .sort(
        (a, b) =>
          new Date(a.expiry_date!).getTime() -
          new Date(b.expiry_date!).getTime()
      )
      .slice(0, 6);
  }, [expiringSoon]);

  const statsLoading =
    inventoryLoading || expiringLoading || historyLoading || mealPlanLoading;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(" ")[0] ?? "Chef"}`}
        subtitle={formatDate(today)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Refrigerator}
              iconClassName="bg-primary/10 text-primary-dark"
              label="Pantry Items"
              value={inventory?.items.length ?? 0}
            />
            <StatCard
              icon={AlertTriangle}
              iconClassName="bg-amber-500/10 text-amber-600"
              label="Expiring Soon"
              value={expiringSoon?.expiring_count ?? 0}
            />
            <StatCard
              icon={Flame}
              iconClassName="bg-orange-500/10 text-orange-600"
              label="Cooked This Week"
              value={cookedThisWeek}
            />
            <StatCard
              icon={Target}
              iconClassName="bg-primary/10 text-primary-dark"
              label="Meal Plan"
              value={`${mealPlanCompletion}%`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodaysMeals mealPlan={mealPlan} isLoading={mealPlanLoading} />
        <ExpiringItems expiringItems={expiringItems} isLoading={expiringLoading} />
      </div>

      <QuickActions />
    </div>
  );
}

function LandingPage() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <Nav />
        <main>
          <Hero />
          <Features />
          <Showcase />
          <ScrollStory />
          <Sustainability />
          <Download />
        </main>
        <Footer />
      </TranslationProvider>
    </ThemeProvider>
  );
}

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}

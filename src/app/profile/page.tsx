"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Settings, Users, CreditCard, ChevronRight } from "lucide-react";
import { Avatar, Card, CardBody, Badge, Button, Divider, Spinner } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => api.getSubscription(),
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => api.getProfile(),
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="md" />
      </div>
    );
  }

  const displayUser = profile ?? user;
  const isPro = subscription?.tier === "pro" || subscription?.tier === "family";

  const settingsRows = [
    { icon: Settings, label: "Account & Settings", href: "/settings" },
    { icon: Users, label: "Family", href: "/family" },
    { icon: CreditCard, label: "Subscription", href: "/subscription" },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <PageHeader title="Profile" />

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-3 py-4">
        <Avatar
          alt={displayUser?.name ?? "User"}
          size="xl"
        />
        <div className="text-center">
          <h2 className="text-xl font-bold text-heading font-serif">{displayUser?.name}</h2>
          <p className="text-sm text-muted">{displayUser?.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {!subLoading && subscription && (
            <Badge variant={isPro ? "success" : "default"}>
              {subscription.tier.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      {displayUser && (
        <Card>
          <CardBody>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-heading">{displayUser.household_size}</p>
                <p className="text-xs text-muted mt-0.5">Household</p>
              </div>
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-heading">{displayUser.dietary_restrictions.length}</p>
                <p className="text-xs text-muted mt-0.5">Dietary tags</p>
              </div>
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-heading">{displayUser.allergies.length}</p>
                <p className="text-xs text-muted mt-0.5">Allergies</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Navigation links */}
      <Card>
        <CardBody className="p-0">
          {settingsRows.map((row, i) => (
            <div key={row.href}>
              {i > 0 && <Divider />}
              <button
                onClick={() => router.push(row.href)}
                className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-card transition-colors text-left"
              >
                <row.icon className="w-4 h-4 text-muted flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-heading">{row.label}</span>
                <ChevronRight className="w-4 h-4 text-muted" />
              </button>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Sign out */}
      <Button
        variant="danger"
        className="w-full"
        onClick={async () => {
          await logout();
          router.push("/login");
        }}
      >
        Sign out
      </Button>
    </div>
  );
}

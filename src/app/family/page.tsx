"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, User, Copy, Check } from "lucide-react";
import { Card, CardBody, CardHeader, Button, Input, Badge, Divider, Spinner, Alert } from "@cookest/ui";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";
import type { Household } from "@/lib/types";

function EmptyState() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
      queryClient.invalidateQueries({ queryKey: ["household"] });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-heading font-serif">Plan meals together</h2>
        <p className="text-sm text-muted leading-relaxed">
          Create a family so everyone can help choose what to cook, or join an existing one with an invite code.
        </p>
      </div>

      {error && (
        <Alert variant="error">
          <span>{error}</span>
        </Alert>
      )}

      {/* Create */}
      <Card>
        <CardBody className="space-y-3">
          <h3 className="font-semibold text-heading">Create a family</h3>
          <Input
            label="Family name"
            placeholder="e.g. The Smiths"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="primary"
            className="w-full"
            disabled={loading || !name.trim()}
            onClick={() => run(() => api.createHousehold(name.trim()))}
          >
            {loading ? <Spinner size="sm" /> : "Create family"}
          </Button>
        </CardBody>
      </Card>

      <div className="flex items-center gap-3">
        <Divider />
        <span className="text-xs text-muted whitespace-nowrap">Have an invite code?</span>
        <Divider />
      </div>

      {/* Join */}
      <Card>
        <CardBody className="space-y-3">
          <Input
            label="Invite code"
            placeholder="Paste the code you received"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="secondary"
            className="w-full"
            disabled={loading || !code.trim()}
            onClick={() => run(() => api.joinHousehold(code.trim()).then(() => undefined))}
          >
            {loading ? <Spinner size="sm" /> : "Join family"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

function HouseholdView({ household }: { household: Household }) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    try {
      const code = await api.createHouseholdInvite(household.id);
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: show the code visually
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-heading font-serif">{household.name}</h2>
        <p className="text-sm text-muted">
          {household.members.length} member{household.members.length !== 1 ? "s" : ""}
        </p>
      </div>

      <Card>
        <CardBody className="divide-y divide-border p-0">
          {household.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">{m.name || "Member"}</p>
                <p className="text-xs text-muted truncate">{m.email}</p>
              </div>
              {m.role === "owner" && (
                <Badge variant="default" size="sm">Owner</Badge>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      <Button
        variant="primary"
        className="w-full"
        disabled={loading}
        onClick={handleInvite}
      >
        {loading ? (
          <Spinner size="sm" />
        ) : copied ? (
          <><Check className="w-4 h-4" /> Invite code copied!</>
        ) : (
          <><UserPlus className="w-4 h-4" /> Invite a family member</>
        )}
      </Button>
    </div>
  );
}

export default function FamilyPage() {
  const { data: household, isLoading } = useQuery<Household | null>({
    queryKey: ["household"],
    queryFn: () => api.getMyHousehold(),
  });

  return (
    <div className="animate-fade-in">
      <PageHeader title="Family" subtitle="Share meal planning with your household" />

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="md" />
        </div>
      ) : household ? (
        <HouseholdView household={household} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

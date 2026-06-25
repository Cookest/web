"use client";

import { useState } from "react";
import { MessageSquare, Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@cookest/ui";
import type { ChatSession } from "@/lib/types";

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-[var(--ck-border)] h-14"
        />
      ))}
    </div>
  );
}

interface SessionListProps {
  sessions: ChatSession[];
  activeSessionId: number | null;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onNewChat: () => void;
  isLoading: boolean;
}

export function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onDelete,
  onNewChat,
  isLoading,
}: SessionListProps) {
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  return (
    <aside className="w-60 shrink-0 border-r border-[var(--ck-border)] bg-[var(--ck-surface)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[var(--ck-border)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-[var(--ck-primary)]" />
          <h2 className="font-semibold text-[var(--ck-heading)] text-lg font-[family-name:var(--font-heading)]">
            AI Chef
          </h2>
        </div>
        <Button
          className="w-full flex items-center justify-center gap-2"
          onClick={onNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <SidebarSkeleton />
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center text-sm text-[var(--ck-text-muted)]">
            No conversations yet
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                  activeSessionId === session.id
                    ? "bg-[var(--ck-primary)]/10 border border-[var(--ck-primary)]/30"
                    : "hover:bg-[var(--ck-surface-muted)] border border-transparent"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-[var(--ck-text-muted)] mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--ck-heading)] truncate">
                      {session.title || "New conversation"}
                    </p>
                    <p className="text-xs text-[var(--ck-text-muted)] mt-0.5">
                      {relativeTime(session.updated_at)}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                {pendingDelete === session.id ? (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      className="text-xs text-red-600 font-medium hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                        setPendingDelete(null);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-xs text-[var(--ck-text-muted)] hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDelete(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDelete(session.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

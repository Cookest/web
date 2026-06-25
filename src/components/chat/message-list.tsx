"use client";

import { useRef, useEffect } from "react";
import { ChefHat } from "lucide-react";
import { Badge as BadgeUI } from "@cookest/ui";
import type { ChatMessage } from "@/lib/types";

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function MessagesSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {[false, true, false].map((isUser, i) => (
        <div
          key={i}
          className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
        >
          {!isUser && (
            <div className="h-8 w-8 rounded-full bg-[var(--ck-border)] animate-pulse shrink-0" />
          )}
          <div
            className={`animate-pulse rounded-2xl h-16 ${
              isUser ? "w-48 bg-[var(--ck-primary)]/20" : "w-64 bg-[var(--ck-border)]"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-[var(--ck-text-muted)] animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  userName: string;
  lastActions?: string[];
}

export function MessageList({
  messages,
  isLoading,
  isSending,
  userName,
  lastActions = [],
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const userInitial = userName?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isSending]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
      {isLoading ? (
        <MessagesSkeleton />
      ) : (
        <>
          {messages.map((msg, idx) => (
            <div
              key={`${msg.id}-${idx}`}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant avatar */}
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-[var(--ck-primary)]/10 flex items-center justify-center shrink-0 mt-1">
                  <ChefHat className="h-4 w-4 text-[var(--ck-primary)]" />
                </div>
              )}

              <div
                className={`max-w-[70%] ${
                  msg.role === "user" ? "order-first" : ""
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === "user"
                      ? "bg-[var(--ck-primary)] text-white rounded-br-md"
                      : "bg-[var(--ck-surface)] border border-[var(--ck-border)] text-[var(--ck-heading)] rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Actions badge — show on last assistant message */}
                {msg.role === "assistant" &&
                  idx === messages.length - 1 &&
                  lastActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {lastActions.map((action) => (
                        <BadgeUI key={action} className="text-xs bg-[var(--ck-primary)]/10 text-[var(--ck-primary)] border-[var(--ck-primary)]/20">
                          {action}
                        </BadgeUI>
                      ))}
                    </div>
                  )}

                <p
                  className={`text-[10px] text-[var(--ck-text-muted)] mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTimestamp(msg.created_at)}
                </p>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-[var(--ck-heading)] flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xs font-medium text-[var(--ck-surface)]">
                    {userInitial}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-[var(--ck-primary)]/10 flex items-center justify-center shrink-0 mt-1">
                <ChefHat className="h-4 w-4 text-[var(--ck-primary)]" />
              </div>
              <div className="rounded-2xl bg-[var(--ck-surface)] border border-[var(--ck-border)] rounded-bl-md">
                <LoadingDots />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

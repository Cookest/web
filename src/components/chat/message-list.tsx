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
            <div className="h-8 w-8 rounded-full bg-[#e4ebe0] animate-pulse shrink-0" />
          )}
          <div
            className={`animate-pulse rounded-2xl h-16 ${
              isUser ? "w-48 bg-[#7a9a65]/20" : "w-64 bg-[#e4ebe0]/60"
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
          className="h-2 w-2 rounded-full bg-[#7a8e74] animate-bounce"
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
                <div className="h-8 w-8 rounded-full bg-[#7a9a65]/10 flex items-center justify-center shrink-0 mt-1">
                  <ChefHat className="h-4 w-4 text-[#7a9a65]" />
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
                      ? "bg-[#7a9a65] text-white rounded-br-md"
                      : "bg-white border border-[#e4ebe0] text-[#1c3a2a] rounded-bl-md"
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
                        <BadgeUI key={action} className="text-xs bg-[#7a9a65]/10 text-[#7a9a65] border-[#7a9a65]/20">
                          {action}
                        </BadgeUI>
                      ))}
                    </div>
                  )}

                <p
                  className={`text-[10px] text-[#7a8e74] mt-1 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTimestamp(msg.created_at)}
                </p>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-[#1c3a2a] flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xs font-medium text-white">
                    {userInitial}
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-[#7a9a65]/10 flex items-center justify-center shrink-0 mt-1">
                <ChefHat className="h-4 w-4 text-[#7a9a65]" />
              </div>
              <div className="rounded-2xl bg-white border border-[#e4ebe0] rounded-bl-md">
                <LoadingDots />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

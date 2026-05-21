"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Plus,
  Trash2,
  Send,
  ChefHat,
  Sparkles,
  User,
  Loader2,
  ArrowUp,
} from "lucide-react";
import { Button, Card, CardBody, Badge } from "@cookest/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ChatSession, ChatMessage, ChatResponse } from "@/lib/types";

// ── Helpers ──

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

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Skeletons ──

function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-[#e4ebe0]/60 h-14"
        />
      ))}
    </div>
  );
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

// ── Loading dots ──

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

// ── Suggested prompts ──

const SUGGESTED_PROMPTS = [
  "What can I make with chicken?",
  "Plan a healthy week",
  "Substitute for butter",
  "Quick 15-min dinner ideas",
];

// ── Main page ──

export default function ChatPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    []
  );
  const [isThinking, setIsThinking] = useState(false);
  const [lastActions, setLastActions] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Queries ──

  const {
    data: sessions = [],
    isLoading: sessionsLoading,
  } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => api.getChatSessions(),
  });

  const {
    data: messages = [],
    isLoading: messagesLoading,
  } = useQuery({
    queryKey: ["chatMessages", activeSessionId],
    queryFn: () => api.getChatMessages(activeSessionId!),
    enabled: activeSessionId !== null,
  });

  // Combined messages (server + optimistic)
  const allMessages = [...messages, ...optimisticMessages];

  // ── Mutations ──

  const sendMutation = useMutation({
    mutationFn: (data: { message: string; session_id?: number }) =>
      api.sendChatMessage(data),
    onMutate: (variables) => {
      const optimistic: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: variables.message,
        created_at: new Date().toISOString(),
      };
      setOptimisticMessages((prev) => [...prev, optimistic]);
      setIsThinking(true);
      setLastActions([]);
    },
    onSuccess: (data: ChatResponse) => {
      setIsThinking(false);
      setOptimisticMessages([]);
      if (data.actions_taken?.length) {
        setLastActions(data.actions_taken);
      }
      // If this was a new conversation, set the active session
      if (activeSessionId === null) {
        setActiveSessionId(data.session_id);
      }
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      queryClient.invalidateQueries({
        queryKey: ["chatMessages", data.session_id],
      });
    },
    onError: () => {
      setIsThinking(false);
      setOptimisticMessages([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteChatSession(id),
    onSuccess: (_, deletedId) => {
      if (activeSessionId === deletedId) {
        setActiveSessionId(null);
        setOptimisticMessages([]);
        setLastActions([]);
      }
      setPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });

  // ── Auto-scroll ──

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages.length, isThinking]);

  // ── Auto-resize textarea ──

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * 4;
    ta.style.height = `${Math.min(ta.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [message, resizeTextarea]);

  // ── Handlers ──

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || sendMutation.isPending) return;
    setMessage("");
    sendMutation.mutate({
      message: trimmed,
      session_id: activeSessionId ?? undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setOptimisticMessages([]);
    setLastActions([]);
    setMessage("");
  };

  const handleSuggestion = (prompt: string) => {
    setMessage("");
    sendMutation.mutate({ message: prompt });
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // ── Render ──

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#fafaf6]">
      {/* ── Left Sidebar ── */}
      <aside className="w-60 shrink-0 border-r border-[#e4ebe0] bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e4ebe0]">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[#7a9a65]" />
            <h2 className="font-semibold text-[#1c3a2a] text-lg font-[family-name:var(--font-heading)]">
              AI Chef
            </h2>
          </div>
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto">
          {sessionsLoading ? (
            <SidebarSkeleton />
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#7a8e74]">
              No conversations yet
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                    activeSessionId === session.id
                      ? "bg-[#7a9a65]/10 border border-[#7a9a65]/30"
                      : "hover:bg-[#fafaf6] border border-transparent"
                  }`}
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setOptimisticMessages([]);
                    setLastActions([]);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-[#7a8e74] mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#1c3a2a] truncate">
                        {session.title || "New conversation"}
                      </p>
                      <p className="text-xs text-[#7a8e74] mt-0.5">
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
                          deleteMutation.mutate(session.id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="text-xs text-[#7a8e74] hover:underline"
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

      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {activeSessionId === null && allMessages.length === 0 ? (
          /* ── Empty / Welcome State ── */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#7a9a65]/10 flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-[#7a9a65]" />
              </div>
              <h1 className="text-2xl font-semibold text-[#1c3a2a] mb-2 font-[family-name:var(--font-heading)]">
                Ask me anything about cooking
              </h1>
              <p className="text-[#7a8e74] mb-8">
                I can help with recipes, meal planning, ingredient substitutions,
                and more.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className="text-left rounded-xl border border-[#e4ebe0] bg-white px-4 py-3 text-sm text-[#1c3a2a] hover:border-[#7a9a65]/40 hover:bg-[#7a9a65]/5 transition-colors"
                    onClick={() => handleSuggestion(prompt)}
                    disabled={sendMutation.isPending}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Messages Area ── */
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messagesLoading ? (
                <MessagesSkeleton />
              ) : (
                <>
                  {allMessages.map((msg, idx) => (
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
                          idx === allMessages.length - 1 &&
                          lastActions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {lastActions.map((action) => (
                                <Badge key={action} className="text-xs bg-[#7a9a65]/10 text-[#7a9a65] border-[#7a9a65]/20">
                                  {action}
                                </Badge>
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
                  {isThinking && (
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
          </>
        )}

        {/* ── Message Input ── */}
        <div className="border-t border-[#e4ebe0] bg-white p-4">
          <div className="max-w-3xl mx-auto flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Chef..."
                disabled={sendMutation.isPending}
                rows={1}
                className="w-full resize-none rounded-xl border border-[#e4ebe0] bg-[#fafaf6] px-4 py-3 text-sm text-[#1c3a2a] placeholder:text-[#7a8e74]/60 focus:outline-none focus:border-[#7a9a65] focus:ring-1 focus:ring-[#7a9a65]/30 disabled:opacity-50 transition-colors"
                style={{ lineHeight: "24px" }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!message.trim() || sendMutation.isPending}
              className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center p-0"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

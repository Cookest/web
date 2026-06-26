"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { ChatMessage, ChatResponse } from "@/lib/types";
import { SessionList } from "@/components/chat/session-list";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import { toast } from "sonner";

export default function ChatPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [lastActions, setLastActions] = useState<string[]>([]);

  // ── Queries ──

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: () => api.getChatSessions(),
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["chatMessages", activeSessionId],
    queryFn: () => api.getChatMessages(activeSessionId!),
    enabled: activeSessionId !== null,
  });

  const allMessages = [...messages, ...optimisticMessages];

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
      if (data.actions_taken?.length) setLastActions(data.actions_taken);
      if (activeSessionId === null) setActiveSessionId(data.session_id);
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      queryClient.invalidateQueries({ queryKey: ["chatMessages", data.session_id] });
    },
    onError: (e: any) => {
      setIsThinking(false);
      setOptimisticMessages((prev) => prev.slice(0, -1));
      if (e.message?.includes("Pro")) {
        router.push("/pricing");
      } else {
        toast.error("Failed to send message");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteChatSession(id),
    onSuccess: (_, deletedId) => {
      if (activeSessionId === deletedId) resetState();
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
    },
  });

  const resetState = () => {
    setActiveSessionId(null);
    setOptimisticMessages([]);
    setLastActions([]);
  };

  const handleSend = (text: string) => {
    sendMutation.mutate({ message: text, session_id: activeSessionId ?? undefined });
  };

  const handleSelectSession = (id: number) => {
    setActiveSessionId(id);
    setOptimisticMessages([]);
    setLastActions([]);
  };

  return (
    <div className="flex h-[calc(100dvh-64px)] md:h-[100dvh] w-full overflow-hidden bg-[#fafaf6]">
      <SessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={handleSelectSession}
        onDelete={(id) => deleteMutation.mutate(id)}
        onNewChat={resetState}
        isLoading={sessionsLoading}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {activeSessionId === null && allMessages.length === 0 ? (
          <WelcomeScreen
            onSelectPrompt={(p) => sendMutation.mutate({ message: p })}
            disabled={sendMutation.isPending}
          />
        ) : (
          <MessageList
            messages={allMessages}
            isLoading={messagesLoading}
            isSending={isThinking}
            userName={user?.name || ""}
            lastActions={lastActions}
          />
        )}

        <ChatInput onSend={handleSend} isSending={sendMutation.isPending} />
      </main>
    </div>
  );
}

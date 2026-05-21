import type {
  ChatSession,
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from "../types";
import { client } from "./client";

export async function sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
  return client.request("/api/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return client.request("/api/chat/sessions");
}

export async function getChatMessages(sessionId: number): Promise<ChatMessage[]> {
  return client.request(`/api/chat/sessions/${sessionId}/messages`);
}

export async function deleteChatSession(sessionId: number): Promise<void> {
  return client.request(`/api/chat/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendChatMessage,
  getChatSessions,
  getChatMessages,
  deleteChatSession,
} from "../chat";
import { client } from "../client";
import { mockFetchResponse } from "@/__tests__/helpers";

describe("chat API", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockReset();
    localStorage.clear();
    client.setToken("test-token");
  });

  describe("sendChatMessage", () => {
    it("sends message without session_id", async () => {
      const response = {
        message: "Here is a recipe suggestion",
        session_id: 42,
      };
      mockFetchResponse(response);

      const result = await sendChatMessage({ message: "Suggest a recipe" });

      expect(result).toEqual(response);
      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/chat");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({ message: "Suggest a recipe" });
    });

    it("sends message with session_id", async () => {
      mockFetchResponse({ message: "Sure!", session_id: 42 });

      await sendChatMessage({ message: "Thanks", session_id: 42 });

      const body = JSON.parse(
        (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body
      );
      expect(body).toEqual({ message: "Thanks", session_id: 42 });
    });
  });

  describe("getChatSessions", () => {
    it("calls GET on sessions endpoint", async () => {
      mockFetchResponse([]);

      await getChatSessions();

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/chat/sessions");
    });
  });

  describe("getChatMessages", () => {
    it("calls correct endpoint with session ID", async () => {
      mockFetchResponse([]);

      await getChatMessages(42);

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("/api/chat/sessions/42/messages");
    });
  });

  describe("deleteChatSession", () => {
    it("calls DELETE with session ID", async () => {
      mockFetchResponse(undefined, 204);

      await deleteChatSession(42);

      const [url, opts] = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toContain("/api/chat/sessions/42");
      expect(opts.method).toBe("DELETE");
    });
  });
});

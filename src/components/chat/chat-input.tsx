"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@cookest/ui";

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

export function ChatInput({ onSend, isSending }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;
    setMessage("");
    onSend(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#e4ebe0] bg-white p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Chef..."
            disabled={isSending}
            rows={1}
            className="w-full resize-none rounded-xl border border-[#e4ebe0] bg-[#fafaf6] px-4 py-3 text-sm text-[#1c3a2a] placeholder:text-[#7a8e74]/60 focus:outline-none focus:border-[#7a9a65] focus:ring-1 focus:ring-[#7a9a65]/30 disabled:opacity-50 transition-colors"
            style={{ lineHeight: "24px" }}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center p-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Alert, Button } from "@/components/ui";
import { callApi } from "@/lib/client";
import { extractReply } from "@/lib/mappers";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = ["How should I split a monthly income of 200,000?", "Give me three tips for saving more"];

export function AssistantChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading]);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || loading) return;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    setError("");
    setLoading(true);
    try {
      // ASSUMPTION: the request field is "prompt". Change it here if the backend expects another name.
      const raw = await callApi("/api/backend/Ai/test-ai", { body: { prompt } });
      setMessages((m) => [...m, { role: "assistant", text: extractReply(raw) }]);
      router.refresh(); // balances may have changed if the assistant made a transfer
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant could not answer.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  return (
    <div className="flex h-[calc(100dvh-20rem)] min-h-96 flex-col rounded-2xl border border-line bg-surface">
      <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-muted">Ask a money question, or tell the assistant what to send.</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-3.5 py-1.5 text-sm hover:bg-paper">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 ${
              m.role === "user" ? "bg-pine text-white" : "bg-paper"
            }`}>
              {m.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex" role="status" aria-label="Assistant is typing">
            <span className="flex gap-1 rounded-2xl bg-paper px-4 py-3.5">
              {[0, 150, 300].map((d) => (
                <span key={d} className="size-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
              ))}
            </span>
          </div>
        )}
        {error && <Alert>{error}</Alert>}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSubmit} className="flex items-end gap-3 border-t border-line p-4">
        <textarea
          aria-label="Message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 outline-none focus:border-[var(--focus)]"
        />
        <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
      </form>
    </div>
  );
}

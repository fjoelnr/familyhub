"use client";
import { useState, useRef, FormEvent } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPanel() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const sc = useRef<HTMLDivElement>(null);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Msg = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMsgs }),
    });
    const { reply } = await res.json();
    setMsgs([...newMsgs, { role: "assistant", content: reply.content }]);
    sc.current?.scrollTo(0, sc.current.scrollHeight);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={sc} className="flex-1 overflow-auto p-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="p-2 border-t border-gray-600 flex">
        <input
          className="flex-1 bg-gray-800 text-sm text-gray-100 p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Sag etwas..."
        />
        <button type="submit" className="bg-blue-600 px-4 rounded-r">Send</button>
      </form>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/ui/sendChatMessage";
import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";

export default function InputDeck() {
    const [text, setText] = useState("");
    const { pushResponse, setBusy, uiState } = useAgentRuntime();
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus when entering interaction mode
    useEffect(() => {
        if (uiState === 'chat' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [uiState]);

    // In confirmation mode, we focus entirely on the action decision.
    // The input deck should be hidden to reduce noise.
    if (uiState === "awaiting_action") {
        return null;
    }

    async function submit() {
        if (!text.trim()) return;

        // Immediately show user message
        const userText = text;
        setText(""); // Clear input early

        pushResponse({
            type: "chat",
            role: "user",
            text: userText,
        });

        setBusy(true);
        try {
            const response = await sendChatMessage(userText);
            pushResponse(response);
        } catch (e) {
            console.error(e);
            pushResponse({
                type: "error",
                role: "assistant",
                text: "Failed to contact FamilyHub backend.",
            });
        } finally {
            setBusy(false);
            // Re-focus after sending
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }

    return (
        <div className="flex gap-2 p-3 border-t bg-slate-900 border-slate-800">
            <input
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="flex-1 border border-slate-700 bg-slate-800 px-3 py-2 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder={uiState === 'idle' ? "Wake up FamilyHub..." : "Ask something..."}
            />
            <button
                onClick={submit}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
                disabled={!text.trim()}
            >
                Send
            </button>
        </div>
    );
}

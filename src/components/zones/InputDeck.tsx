"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/ui/sendChatMessage";
import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";

export default function InputDeck() {
    const [text, setText] = useState("");
    const { pushResponse, setActivityStatus, uiState, state } = useAgentRuntime();
    const inputRef = useRef<HTMLInputElement>(null);

    // Lock input when sending or waiting
    const isLocked = state.activityStatus === 'sending' || state.activityStatus === 'waiting_for_response';

    // Auto-focus when entering interaction mode (and not locked)
    useEffect(() => {
        if (uiState === 'chat' && !isLocked && inputRef.current) {
            inputRef.current.focus();
        }
    }, [uiState, isLocked]);

    // In confirmation mode, we focus entirely on the action decision.
    if (uiState === "awaiting_action") {
        return null;
    }

    async function submit() {
        if (!text.trim() || isLocked) return;

        // Immediately show user message
        const userText = text;
        setText(""); // Clear input early

        pushResponse({
            type: "chat",
            role: "user",
            text: userText,
        });

        // Update Status: sending -> waiting
        setActivityStatus('sending');

        try {
            setActivityStatus('waiting_for_response');

            const response = await sendChatMessage(userText);
            pushResponse(response);
            // pushResponse resets status to idle/error automatically
        } catch (e) {
            console.error(e);
            pushResponse({
                type: "error",
                role: "assistant",
                text: "Failed to contact FamilyHub backend.",
            });
            // Manual reset if pushResponse didn't handle it (it does handle error type)
            setActivityStatus('error');
        } finally {
            // Re-focus after sending if not busy
            setTimeout(() => {
                if (inputRef.current) inputRef.current.focus();
            }, 10);
        }
    }

    const EXAMPLE_PROMPTS = [
        "Was steht heute an?",
        "Zeig mir meine nächsten Termine",
        "Was ist heute wichtig?",
        "Schreib Brot auf die Einkaufsliste"
    ];

    return (
        <div className={`w-full max-w-4xl mx-auto flex flex-col gap-3 transition-opacity duration-300 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>

            {/* Example Prompts - Only show when no text is typed and in Idle/Empty Chat */}
            {!text && uiState === 'idle' && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start animate-in fade-in slide-in-from-bottom-1 duration-300 mb-1">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setText(prompt);
                                inputRef.current?.focus();
                            }}
                            className="text-xs font-medium text-[var(--accent-gold)] bg-[var(--surface-highlight)]/30 hover:bg-[var(--surface-highlight)] border border-[var(--border)] hover:border-[var(--accent-gold)] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Row */}
            <div className="flex items-center gap-3 bg-[var(--surface-dark)] p-2 rounded-2xl border border-[var(--border)] shadow-lg focus-within:ring-2 focus-within:ring-[var(--interaction-blue)] transition-shadow">
                <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    disabled={isLocked}
                    className="flex-1 bg-transparent px-3 py-2 text-[var(--text-primary)] placeholder:[var(--text-secondary)] focus:outline-none disabled:cursor-not-allowed text-base font-medium"
                    placeholder="Frag Valur..."
                />
                <button
                    onClick={submit}
                    className={`
                        w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${text.trim()
                            ? 'bg-[var(--interaction-blue)] text-white hover:bg-blue-600 shadow-md'
                            : 'bg-[var(--surface-highlight)] text-slate-500 cursor-not-allowed'}
                    `}
                    disabled={!text.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

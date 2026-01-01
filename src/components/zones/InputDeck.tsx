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
            // Simulate 'sending' -> 'waiting' transition if needed, 
            // but sendChatMessage is one async call. 
            // Let's set 'waiting_for_response' immediately before call or just 'sending'.
            // Requirements say: "thinking" / activity indicator.
            // Let's use 'waiting_for_response' as the main busy state.
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
        "Zeig mir meine nächsten Termine.",
        "Füge eine Info für die Familie hinzu.",
        "Worum geht’s morgen?"
    ];

    return (
        <div className={`flex flex-col gap-2 p-3 border-t bg-slate-900 border-slate-800 transition-opacity duration-300 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>

            {/* Input Row */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    disabled={isLocked}
                    className="flex-1 border border-slate-700 bg-slate-800 px-3 py-2 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:cursor-not-allowed"
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

            {/* Example Prompts - Only show when no text is typed */}
            {!text && (
                <div className="flex flex-wrap gap-2 px-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
                    {EXAMPLE_PROMPTS.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setText(prompt);
                                inputRef.current?.focus();
                            }}
                            className="text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

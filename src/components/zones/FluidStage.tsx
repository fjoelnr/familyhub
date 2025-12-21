"use client";

import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";
import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import { AgentResponse } from "@/lib/contracts/agents";

import AmbientCanvas from "@/components/zones/AmbientCanvas";

// --- SUBLAYOUT: Awaiting Confirmation ---
function ConfirmationView({
    response,
    onConfirm,
    onCancel
}: {
    response: AgentResponse;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="flex items-center justify-center h-full animate-in zoom-in-95 duration-300">
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-lg w-full shadow-2xl space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-light text-white">Confirmation Required</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">{response.text}</p>
                </div>

                {response.actionResult && (
                    <div className="bg-slate-900/50 p-4 rounded border border-slate-800 font-mono text-sm text-blue-300 overflow-x-auto">
                        <pre>{JSON.stringify(response.actionResult, null, 2)}</pre>
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-blue-900/20"
                    >
                        Confirm Action
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- MAIN LAYOUT ---
export default function FluidStage() {
    const { state, uiState, resetToIdle, pushResponse } = useAgentRuntime();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { context } = useFamilyHub(); // Access mainly for debug if needed, but IdleDashboard uses it

    const handleConfirm = async () => {
        // Find the action payload to send back
        const actionResponse = state.responses.findLast((r) => r.requiresConfirmation);
        const payload = actionResponse?.actionResult?.payload;

        // Optimistic UI update handled by resetting to idle? 
        // No, we want to show "Confirmed" message or wait for response.
        // We push a "User Confirmed" message.
        const message = `Confirm calendar event: ${JSON.stringify(payload)}`;

        resetToIdle(); // Close the modal immediately

        pushResponse({
            type: "chat",
            role: "user",
            text: "Confirmed.", // Show pretty text in chat
        });

        // We stay in chat mode effectively (or background)
        // Actually resetToIdle sets state to idle.
        // But sendChatMessage might take time.
        // If we want to see the result, we should be in chat mode?
        // UR-007 says return to calm after inactivity. 
        // If we confirm, we probably want to see the "Success" message.

        // Let's NOT resetToIdle immediately if we want to see result.
        // But the requirements say "blocking confirmation UI".
        // Once confirmed, the blocking UI should vanish.
        // So we switch to 'chat' state effectively? (which is default if not idle/awaiting).
        // resetToIdle sets 'idle'. 
        // useAgentRuntime pushResponse calls startInteraction() automatically for new messages.
        // So pushing response triggers chat mode.

        try {
            const response = await import("@/lib/ui/sendChatMessage").then(m => m.sendChatMessage(message));
            pushResponse(response);
        } catch (e) {
            console.error(e);
            pushResponse({
                type: "error",
                role: "assistant",
                text: "Failed to execute action.",
            });
        }
    };

    const handleCancel = () => {
        resetToIdle();
        pushResponse({
            type: "chat",
            role: "user",
            text: "Cancelled.",
        });
        // We don't necessarily need to tell backend, but contextually it's good.
        // For now, just local cancel is safe as backend is stateless.
    };

    // 1. Idle State
    if (uiState === "idle") {
        return (
            <div className="flex-1 h-full overflow-hidden relative">
                <AmbientCanvas />
            </div>
        );
    }

    // 2. Confirmation State (Priority over chat if active)
    if (uiState === "awaiting_action") {
        // Find the last response that triggered this state
        const actionResponse = state.responses.findLast((r) => r.requiresConfirmation);
        if (actionResponse) {
            return (
                <div className="flex-1 h-full overflow-hidden relative p-4">
                    <ConfirmationView
                        response={actionResponse}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                </div>
            );
        }
        // Fallback if no response found (shouldn't happen)
        return <div className="flex-1 flex items-center justify-center">Error: No Action Found</div>;
    }

    // 3. Chat / Interaction State
    return (
        <div className="flex-1 overflow-auto p-4 space-y-4 pb-20 scroll-smooth">
            {state.responses.map((r, i) => (
                <div
                    key={i}
                    className={`flex flex-col max-w-[80%] animate-in slide-in-from-bottom-2 duration-300 ${r.role === "user"
                        ? "self-end items-end ml-auto"
                        : "self-start items-start mr-auto"
                        }`}
                >
                    <div
                        className={`rounded-2xl px-5 py-3 shadow-sm ${r.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : r.type === 'error'
                                ? "bg-red-900/50 border border-red-500 text-red-200 rounded-bl-none" // Error Style
                                : "bg-slate-700 border border-slate-600 text-slate-100 rounded-bl-none" // Normal Agent Style
                            }`}
                    >
                        <div className="whitespace-pre-wrap leading-relaxed">{r.text}</div>

                        {/* Telemetry/Meta Info (optional debug or subtle display) */}
                        {r.meta && r.meta.durationMs && (
                            <div className={`text-[10px] mt-1 opacity-50 ${r.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                                {r.meta.durationMs}ms
                            </div>
                        )}

                        {/* Render Calendar Events inline during chat if provided */}
                        {r.actionResult &&
                            Array.isArray(r.actionResult.payload) && (
                                <div className="mt-3 bg-slate-800/50 -mx-2 p-2 rounded">
                                    <CalendarWidget events={r.actionResult.payload} />
                                </div>
                            )}

                        {r.type === 'clarification_needed' && (
                            <div className="mt-2 text-amber-300 text-sm font-medium flex items-center gap-1">
                                <span>🤔</span> Could you clarify?
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Thinking Indicator */}
            {(state.activityStatus === 'sending' || state.activityStatus === 'waiting_for_response') && (
                <div className="self-start items-start mr-auto max-w-[80%] animate-pulse">
                    <div className="bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm flex items-center gap-2">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                        <span className="text-sm font-medium">Thinking...</span>
                    </div>
                </div>
            )}

            {/* Spacer for scrolling */}
            <div className="h-4" />
        </div>
    );
}

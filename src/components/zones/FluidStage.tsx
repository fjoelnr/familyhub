"use client";

import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";
// import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";

// Zones & Widgets
import AmbientCanvas from "@/components/zones/AmbientCanvas";
import CalendarMonthView from "@/components/widgets/CalendarMonthView";
import TaskListView from "@/components/widgets/TaskListView";
import ActivityFeed from "@/components/widgets/ActivityFeed";
import CalendarWidget from "@/components/widgets/CalendarWidget"; // Keeping for chat bubbling if needed
import ContextCard from "@/components/widgets/ContextCard";
import { mockContextCards } from "@/lib/data/mockContext";

// --- MAIN LAYOUT ---
export default function FluidStage() {
    const { state, uiState, pushResponse } = useAgentRuntime();

    // Iteration 3: Handle Gentle Prompt Clicks
    const handlePromptClick = (question: string) => {
        // Inject the system's "gentle" question into the chat
        pushResponse({
            type: 'chat',
            role: 'assistant',
            text: question,
            meta: { source: 'context_card_prompt' }
        });
    };

    // 1. Idle / Dashboard State
    // Default view when no active conversation/action blocking
    if (uiState === "idle") {
        return (
            <div className="flex-1 h-full relative p-4 md:p-6 overflow-hidden">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <AmbientCanvas />
                </div>

                {/* Content Grid (Zone B) */}
                <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Calendar Area (Larger) */}
                    <div className="lg:col-span-8 h-full min-h-[400px]">
                        <CalendarMonthView />
                    </div>

                    {/* Lists & Activity Area (Smaller) */}
                    <div className="lg:col-span-4 h-full flex flex-col gap-6 min-h-[400px]">

                        {/* ITERATION 2: Context Cards Area */}
                        {/* Only show if we have cards (mock data) */}
                        <div className="flex flex-col gap-2">
                            {mockContextCards.map(card => (
                                <ContextCard
                                    key={card.id}
                                    item={card}
                                    onPromptClick={handlePromptClick}
                                />
                            ))}
                        </div>

                        {/* Tasks takes usually more space */}
                        <div className="flex-[3] min-h-0">
                            <TaskListView />
                        </div>
                        {/* Feed takes less space */}
                        <div className="flex-[2] min-h-0">
                            <ActivityFeed />
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // 2. Chat / Interaction State (Active)
    return (
        <div className="flex-1 overflow-auto p-4 space-y-4 pb-20 scroll-smooth bg-[var(--background-dark)]">
            {/* Simple Header for Context Switching */}
            <div className="text-center py-4 text-slate-500 text-sm uppercase tracking-widest border-b border-slate-800">
                Active Session
            </div>

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
                            ? "bg-[var(--interaction-blue)] text-white rounded-br-none"
                            : "bg-[var(--surface-highlight)] border border-[var(--border)] text-slate-100 rounded-bl-none"
                            }`}
                    >
                        <div className="whitespace-pre-wrap leading-relaxed">{r.text}</div>

                        {/* Render Calendar Events inline during chat if provided */}
                        {r.actionResult &&
                            Array.isArray(r.actionResult.payload) && (
                                <div className="mt-3 bg-slate-900/50 -mx-2 p-2 rounded border border-slate-700">
                                    <CalendarWidget events={r.actionResult.payload} />
                                </div>
                            )}
                    </div>
                </div>
            ))}
            {/* Spacer */}
            <div className="h-4" />
        </div>
    );
}

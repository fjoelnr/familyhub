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
        <div className="h-full w-full overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth bg-[var(--background-dark)]">
            {/* Simple Header for Context Switching */}
            <div className="text-center py-4 text-slate-500 text-sm uppercase tracking-widest border-b border-slate-800">
                Active Session
            </div>

            {state.responses.map((r, i) => {
                // Special handling for system/error messages
                if (r.type === 'notice') {
                    return (
                        <div key={i} className="w-full flex justify-center my-4 animate-in fade-in duration-500">
                            <div className="bg-slate-800/40 border border-slate-700/50 text-slate-400 px-4 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-70">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                                </svg>
                                {r.text}
                            </div>
                        </div>
                    );
                }

                if (r.type === 'error') {
                    return (
                        <div key={i} className="w-full flex justify-center my-2 animate-in fade-in duration-300">
                            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-200/80 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></span>
                                {r.text}
                            </div>
                        </div>
                    );
                }

                return (
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
                );
            })}
            {/* Spacer */}
            <div className="h-4" />
        </div>
    );
}

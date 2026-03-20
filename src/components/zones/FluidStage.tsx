"use client";

import { useState, useEffect } from 'react';
import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";
import AmbientCanvas from "@/components/zones/AmbientCanvas";
import CalendarMonthView from "@/components/widgets/CalendarMonthView";
import TaskListView from "@/components/widgets/TaskListView";
import ActivityFeed from "@/components/widgets/ActivityFeed";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import ContextCard from "@/components/widgets/ContextCard";
import { mockContextCards } from "@/lib/data/mockContext";

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
    calendar?: string;
}

export default function FluidStage() {
    const { state, uiState, pushResponse } = useAgentRuntime();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const start = new Date();
                start.setDate(1);
                const end = new Date();
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                
                const res = await fetch(`/api/calendar?start=${start.toISOString()}&end=${end.toISOString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (e) {
                console.error('Failed to fetch calendar events:', e);
            } finally {
                setLoading(false);
            }
        }
        
        if (uiState === 'idle') {
            fetchEvents();
        }
    }, [uiState]);

    const handlePromptClick = (question: string) => {
        pushResponse({
            type: 'chat',
            role: 'assistant',
            text: question,
            meta: { source: 'context_card_prompt' }
        });
    };

    if (uiState === "idle") {
        return (
            <div className="flex-1 h-full relative p-4 md:p-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <AmbientCanvas />
                </div>

                <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 h-full min-h-[400px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-400">
                                Lade Kalender...
                            </div>
                        ) : (
                            <CalendarMonthView events={events} />
                        )}
                    </div>

                    <div className="lg:col-span-4 h-full flex flex-col gap-6 min-h-[400px]">
                        <div className="flex flex-col gap-2">
                            {mockContextCards.map(card => (
                                <ContextCard
                                    key={card.id}
                                    item={card}
                                    onPromptClick={handlePromptClick}
                                />
                            ))}
                        </div>

                        <div className="flex-[3] min-h-0">
                            <TaskListView />
                        </div>
                        <div className="flex-[2] min-h-0">
                            <ActivityFeed />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-4 space-y-4 pb-20 scroll-smooth bg-[var(--background-dark)]">
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

                        {r.actionResult &&
                            Array.isArray(r.actionResult.payload) && (
                                <div className="mt-3 bg-slate-900/50 -mx-2 p-2 rounded border border-slate-700">
                                    <CalendarWidget events={r.actionResult.payload} />
                                </div>
                            )}
                    </div>
                </div>
            ))}
            <div className="h-4" />
        </div>
    );
}

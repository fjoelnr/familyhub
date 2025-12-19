"use client";

import { useEffect, useState } from "react";
import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import { CalendarEvent } from "@/lib/contracts/calendar";

export default function AmbientCanvas() {
    const { context } = useFamilyHub(); // Use central time/date source
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        // Fetch up next events
        // TODO: SWR would be better here
        fetch('/api/calendar?start=' + new Date().toISOString())
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data.slice(0, 3)); // Show top 3
                }
            })
            .catch(err => console.error("Failed to load dashboard events", err));
    }, []);

    // Fallback if context time is missing (shouldn't happen with provider)
    const timeDisplay = context.time || "--:--";
    const dateDisplay = context.date ? new Date(context.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) : "Loading...";

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-700">
            <div className="text-center">
                <div className="text-8xl font-thin tracking-tighter text-[var(--foreground)] transition-colors duration-500" suppressHydrationWarning>
                    {timeDisplay}
                </div>
                <div className="text-2xl font-light text-[var(--foreground)] opacity-80 mt-2 transition-colors duration-500" suppressHydrationWarning>
                    {dateDisplay}
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700/50 w-full max-w-md transition-all hover:bg-slate-800/70">
                <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Up Next
                </h3>
                <CalendarWidget events={events} />
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";
import CalendarWidget from "@/components/widgets/CalendarWidget";
import StartInfoSection from "@/components/widgets/StartInfoSection";
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
        <div className="flex flex-col items-center justify-start h-full pt-[10vh] pb-24 overflow-y-auto no-scrollbar space-y-12 animate-in fade-in duration-700">

            {/* ZONE A: Orientation & Identity */}
            <div className="flex flex-col items-center space-y-8 shrink-0">
                {/* Time & Date */}
                <div className="text-center z-10">
                    <div className="text-8xl font-thin tracking-tighter text-[var(--foreground)] transition-colors duration-500" suppressHydrationWarning>
                        {timeDisplay}
                    </div>
                    <div className="text-2xl font-light text-[var(--foreground)] opacity-80 mt-2 transition-colors duration-500" suppressHydrationWarning>
                        {dateDisplay}
                    </div>
                </div>

                {/* Identity Anchor: Valur Falke on Red Circle */}
                <div className="relative flex items-center justify-center w-[18vmin] h-[18vmin] max-w-32 max-h-32 min-w-20 min-h-20 bg-[#D02020] rounded-full shadow-lg">
                    <img
                        src="/images/valur-falke.png"
                        alt="Valur Identity"
                        className="w-[80%] h-auto object-contain"
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* ZONE B: Context (Scrollable if needed via parent flex) */}
            <div className="flex flex-col items-center w-full max-w-md space-y-8 px-4 shrink-0">
                <div className="w-full bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700/50 transition-all hover:bg-slate-800/70">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Up Next
                    </h3>
                    <CalendarWidget events={events} />
                </div>

                <StartInfoSection />
            </div>
        </div>
    );
}

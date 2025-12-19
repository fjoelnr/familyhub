"use client";

import { CalendarEvent } from "@/lib/contracts/calendar";

export default function CalendarWidget({
    events,
}: {
    events: CalendarEvent[];
}) {
    if (!events || !events.length) {
        return <div className="opacity-60">No upcoming events</div>;
    }

    return (
        <div className="space-y-2">
            {events.map((e) => (
                <details
                    key={e.id}
                    className="border rounded p-2 cursor-pointer"
                >
                    <summary className="font-medium">
                        {e.title}
                        {e.allDay && " (all day)"}
                    </summary>
                    <div className="text-sm opacity-70 mt-1">
                        {new Date(e.start).toLocaleString()} –{" "}
                        {new Date(e.end).toLocaleString()}
                    </div>
                </details>
            ))}
        </div>
    );
}

import { CalendarEvent } from "@/lib/contracts/calendar";

export default function CalendarWidget({
    events,
}: {
    events: { id: string; title: string; start: string }[] | null;
}) {
    if (!events || events.length === 0) {
        return <div className="text-center">Keine Termine</div>;
    }

    return (
        <ul className="space-y-3">
            {events.map((ev) => (
                <li key={ev.id} className="bg-gray-700 rounded-md p-3">
                    <div className="font-semibold text-lg">{ev.title}</div>
                    <div className="text-sm text-gray-300">
                        {new Date(ev.start).toLocaleDateString()}{" "}
                        {new Date(ev.start).toLocaleTimeString()}
                    </div>
                </li>
            ))}
        </ul>
    );
}

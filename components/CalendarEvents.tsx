"use client";

const PLACEHOLDER_EVENTS = [
  { id: "1", title: "Test-Termin: Müll rausbringen", start: "2026-03-20T18:00:00.000Z" },
  { id: "2", title: "Familien-Meeting", start: "2026-03-20T19:00:00.000Z" },
];

export default function CalendarEvents() {
  return (
    <div className="p-4 bg-gray-800/60 rounded-xl shadow-lg shadow-black/50 text-gray-100">
      <h3 className="text-xl font-semibold mb-2">Nächste Termine</h3>
      {PLACEHOLDER_EVENTS.length === 0 ? (
        <p className="text-gray-400">Keine anstehenden Termine</p>
      ) : (
        <ul className="space-y-2">
          {PLACEHOLDER_EVENTS.map((ev) => (
            <li key={ev.id} className="border-b border-gray-700 pb-2">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-400">{new Date(ev.start).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

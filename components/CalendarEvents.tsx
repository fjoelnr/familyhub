"use client";

export default function CalendarEvents() {
  // Placeholder: später ersetze durch echten Kalender-Fetch
  const dummyEvents = [
    { id: "1", title: "Test-Termin: Müll rausbringen", start: new Date().toISOString() },
    { id: "2", title: "Familien-Meeting", start: new Date(Date.now() + 3600 * 1000).toISOString() },
  ];

  return (
    <div className="p-4 bg-gray-800/60 rounded-xl shadow-lg shadow-black/50 text-gray-100">
      <h3 className="text-xl font-semibold mb-2">Nächste Termine</h3>
      {dummyEvents.length === 0 ? (
        <p className="text-gray-400">Keine anstehenden Termine</p>
      ) : (
        <ul className="space-y-2">
          {dummyEvents.map(ev => (
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

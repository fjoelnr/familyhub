"use client";
import dynamic from "next/dynamic";

const Weather = dynamic(() => import("./Weather"), { ssr: false });
const CalendarEvents = dynamic(() => import("./CalendarEvents"), { ssr: false });
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

export default function ClientWrapper() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Weather lat={48.05} lon={11.02} />
        <CalendarEvents />
      </div>
      <ChatPanel />
    </div>
  );
}

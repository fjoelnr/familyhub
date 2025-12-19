"use client";

import { useFamilyHub } from "@/lib/contexts/FamilyHubContext";
import { useAgentRuntime } from "@/lib/contexts/AgentRuntimeContext";
import { useEffect, useState } from "react";
import { UiMode } from "@/lib/contracts/context";

export default function StatusRail() {
    const { context, setUiMode } = useFamilyHub();
    const { uiState } = useAgentRuntime();
    const [time, setTime] = useState<string>("--:--");

    useEffect(() => {
        const tick = () =>
            setTime(
                new Date().toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );

        tick();
        const id = setInterval(tick, 60_000);
        return () => clearInterval(id);
    }, []);

    const modes: { id: UiMode; label: string; icon: string }[] = [
        { id: "calm", label: "Calm", icon: "🍃" },
        { id: "nerdy", label: "Nerdy", icon: "🤓" },
        { id: "manga", label: "Manga", icon: "🗯️" },
    ];

    return (
        <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-900 border-slate-800 text-slate-300">
            <div className="flex items-center gap-4">
                <div className="font-semibold text-slate-100">FamilyHub</div>
                <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setUiMode(m.id)}
                            className={`px-3 py-1 rounded-md text-sm transition-all ${context.uiMode === m.id
                                ? "bg-blue-600 text-white shadow-sm"
                                : "hover:bg-slate-700 text-slate-400"
                                }`}
                            title={m.label}
                        >
                            <span className="mr-1">{m.icon}</span>
                            <span className="hidden sm:inline">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className={`text-xs uppercase tracking-wider font-bold ${uiState !== 'idle' ? 'text-blue-400' : 'text-slate-600'}`}>
                    {uiState === 'idle' ? 'Ambient' : 'Active'}
                </div>
                <div className="font-mono text-slate-400">{time}</div>
            </div>
        </div>
    );
}

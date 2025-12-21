"use client";

import { createContext, useContext, useState } from "react";
import { AgentResponse } from "@/lib/contracts/agents";
import { useUiInteraction, UiInteractionState } from "@/lib/hooks/useUiInteraction";

export type ActivityStatus = 'idle' | 'sending' | 'waiting_for_response' | 'error';

type RuntimeState = {
    responses: AgentResponse[];
    activityStatus: ActivityStatus;
};

const AgentRuntimeContext = createContext<{
    state: RuntimeState;
    uiState: UiInteractionState;
    pushResponse: (r: AgentResponse) => void;
    setActivityStatus: (s: ActivityStatus) => void;
    resetToIdle: () => void;
} | null>(null);

export function AgentRuntimeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<RuntimeState>({
        responses: [],
        activityStatus: 'idle',
    });

    const {
        uiState,
        startInteraction,
        resetToIdle,
        setActionPending,
        scheduleIdleReturn
    } = useUiInteraction();

    return (
        <AgentRuntimeContext.Provider
            value={{
                state,
                uiState,
                pushResponse: (r) => {
                    setState((s) => ({
                        ...s,
                        responses: [...s.responses, r],
                        activityStatus: r.type === 'error' ? 'error' : 'idle' // Reset activity on response
                    }));

                    // State Transition Logic
                    if (r.role === 'user') {
                        startInteraction();
                        // If user types, we stay in chat, no auto-idle yet (wait for response)
                    } else {
                        // Agent response
                        if (r.requiresConfirmation) {
                            setActionPending();
                        } else {
                            startInteraction();
                            scheduleIdleReturn(15000); // Return to idle after 15s of inactivity
                        }
                    }
                },
                setActivityStatus: (status) =>
                    setState((s) => ({
                        ...s,
                        activityStatus: status,
                    })),
                resetToIdle,
            }}
        >
            {children}
        </AgentRuntimeContext.Provider>
    );
}

export function useAgentRuntime() {
    const ctx = useContext(AgentRuntimeContext);
    if (!ctx) {
        throw new Error("useAgentRuntime must be used inside AgentRuntimeProvider");
    }
    return ctx;
}

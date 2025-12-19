"use client";

import { createContext, useContext, useState } from "react";
import { AgentResponse } from "@/lib/contracts/agents";
import { useUiInteraction, UiInteractionState } from "@/lib/hooks/useUiInteraction";

type RuntimeState = {
    responses: AgentResponse[];
    isBusy: boolean;
};

const AgentRuntimeContext = createContext<{
    state: RuntimeState;
    uiState: UiInteractionState;
    pushResponse: (r: AgentResponse) => void;
    setBusy: (b: boolean) => void;
    resetToIdle: () => void;
} | null>(null);

export function AgentRuntimeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = useState<RuntimeState>({
        responses: [],
        isBusy: false,
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
                setBusy: (b) =>
                    setState((s) => ({
                        ...s,
                        isBusy: b,
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

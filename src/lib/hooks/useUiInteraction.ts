import { useState, useCallback, useRef, useEffect } from "react";

export type UiInteractionState = "idle" | "chat" | "awaiting_action";

export function useUiInteraction() {
    const [uiState, setUiState] = useState<UiInteractionState>("idle");
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

    const resetToIdle = useCallback(() => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
        setUiState("idle");
    }, []);

    const startInteraction = useCallback(() => {
        setUiState("chat");
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    const setActionPending = useCallback(() => {
        setUiState("awaiting_action");
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    const scheduleIdleReturn = useCallback((delayMs = 20000) => {
        if (idleTimerRef.current) {
            clearTimeout(idleTimerRef.current);
        }
        idleTimerRef.current = setTimeout(() => {
            setUiState((prev) => (prev === "chat" ? "idle" : prev));
        }, delayMs);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, []);

    return {
        uiState,
        startInteraction,
        resetToIdle,
        setActionPending,
        scheduleIdleReturn,
    };
}

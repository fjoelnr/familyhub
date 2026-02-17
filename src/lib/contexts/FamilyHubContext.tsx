"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ContextSnapshot, UiMode } from '../contracts/context';
import { AgentResponse } from '../contracts/agents';

interface FamilyHubState {
    context: ContextSnapshot;
    latestAgentResponse: AgentResponse | null;
    conversationHistory: AgentResponse[];
    isInteracting: boolean;
}

interface FamilyHubContextType extends FamilyHubState {
    setUiMode: (mode: UiMode) => void;
    addAgentResponse: (response: AgentResponse) => void;
    setInteracting: (interacting: boolean) => void;
}

const defaultSnapshot: ContextSnapshot = {
    date: '', // Set empty initially
    time: '--:--', // Placeholder to prevent layout shift
    dayPhase: 'morning', // default
    dayType: 'schoolDay', // default
    regionalHoliday: null,
    schoolHolidayRange: null,
    uiMode: 'calm',
    presence: { home: true }
};

const FamilyHubContext = createContext<FamilyHubContextType | undefined>(undefined);

export function FamilyHubProvider({ children }: { children: ReactNode }) {
    const [context, setContext] = useState<ContextSnapshot>(defaultSnapshot);
    const [latestAgentResponse, setLatestAgentResponse] = useState<AgentResponse | null>(null);
    const [conversationHistory, setConversationHistory] = useState<AgentResponse[]>([]);
    const [isInteracting, setInteracting] = useState(false);

    // Initialize time and start ticking on mount (Client Side Only)
    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hour = now.getHours();
            let phase: 'morning' | 'afternoon' | 'evening' | 'night' = 'night';
            if (hour >= 5 && hour < 12) phase = 'morning';
            else if (hour >= 12 && hour < 17) phase = 'afternoon';
            else if (hour >= 17 && hour < 22) phase = 'evening';

            setContext(prev => ({
                ...prev,
                date: now.toISOString().split('T')[0],
                time: now.toLocaleTimeString(),
                dayPhase: phase
            }));
        };

        updateTime(); // Immediate update on mount
        const timer = setInterval(updateTime, 1000 * 60); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const setUiMode = (mode: UiMode) => {
        setContext(prev => ({ ...prev, uiMode: mode }));
    };

    const addAgentResponse = (response: AgentResponse) => {
        setLatestAgentResponse(response);
        setConversationHistory(prev => [...prev, response]);
        // If it's a clarification or confirmation, auto-trigger interaction mode
        if (response.type === 'action_request' || response.text?.endsWith('?')) {
            setInteracting(true);
        }
    };

    return (
        <FamilyHubContext.Provider value={{
            context,
            latestAgentResponse,
            conversationHistory,
            isInteracting,
            setUiMode,
            addAgentResponse,
            setInteracting
        }}>
            {children}
        </FamilyHubContext.Provider>
    );
}

export function useFamilyHub() {
    const context = useContext(FamilyHubContext);
    if (context === undefined) {
        throw new Error('useFamilyHub must be used within a FamilyHubProvider');
    }
    return context;
}

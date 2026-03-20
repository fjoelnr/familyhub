// Consolidated ActionResult from agents
export interface ActionResult {
    status: 'success' | 'clarification_needed' | 'confirmation_needed' | 'error';
    summary: string;
    payload?: unknown;
    missingInfo?: string[];
}

export type AgentResponse = {
    type: 'chat' | 'action_request' | 'clarification_needed' | 'error';
    role: 'assistant' | 'user'; // User messages also follow this for UI consistency
    text: string;

    // For actions
    actionResult?: {
        type: string;
        payload: unknown;
    };
    requiresConfirmation?: boolean;

    // Telemetry & Debug
    meta?: {
        source?: string;
        requestId?: string;
        durationMs?: number;
        [key: string]: unknown;
    };
};

// Consolidated ActionResult from agents
export interface ActionResult {
    status: 'success' | 'clarification_needed' | 'confirmation_needed' | 'error';
    summary: string;
    payload?: unknown;
    missingInfo?: string[];
}

export interface AgentResponse {
    type: 'chat' | 'action_request' | 'clarification_needed' | 'error';
    role: 'system' | 'user' | 'assistant';
    text?: string;

    // For action requests
    actionResult?: {
        status: string;
        summary: string;
        payload?: unknown;
    };

    requiresConfirmation?: boolean;
}

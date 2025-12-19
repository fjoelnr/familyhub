import { ContextSnapshot } from "./context";

export type Role = "system" | "user" | "assistant";

export interface Message {
    role: Role;
    content: string;
}

export type ChatProviderName = "ollama" | "openai" | "mock";

export type IntentType =
    | "smalltalk"
    | "information"
    | "planning"
    | "calendar_action"
    | "explanation"
    | "unknown";

export interface IntentResult {
    intent: IntentType;
    confidence: number;
    entities?: {
        date?: string;
        person?: string;
        topic?: string;
        [key: string]: string | undefined;
    };
    rawInput: string;
}


export interface ChatResponse {
    text: string;
    provider: ChatProviderName;
    model: string; // e.g. "llama3" or "gpt-4o"
    meta?: Record<string, unknown>;
}

export interface ChatOptions {
    /** 
     * Force a specific provider, bypassing the routing logic.
     * Useful for debugging or user override.
     */
    forceProvider?: ChatProviderName;

    /**
     * Override standard context injection.
     */
    contextOverride?: Partial<ContextSnapshot>;

    /**
     * Timeout in milliseconds for Ollama.
     * Default: 3000ms (fast fail to fallback)
     */
    timeoutMs?: number;

    /**
     * Override the default system prompt / persona.
     * Useful for classification tasks or specialized agents.
     */
    systemPromptOverride?: string;
}

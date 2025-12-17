import { ChatOptions, ChatResponse, Message, Role } from "@/lib/contracts/ai";
import { getContextSnapshot } from "@/lib/context/getContextSnapshot";
import { callOllama } from "./providers/ollama";
import { callOpenAI } from "./providers/openai";

const PERSONAS: Record<string, string> = {
    calm: "You are a calm, peaceful assistant. Your responses are concise, gentle, and soothing. Avoid unnecessary details.",
    nerdy: "You are a highly technical, nerdy assistant. You love detailed explanations, sci-fi references, and precise data. You speak like a senior engineer or a sci-fi ship computer.",
    manga: "You are an energetic, anime-style assistant! You are enthusiastic, emotive, and use exclamation marks!! (Sometimes you use kaomojis like (⁠◕⁠ᴗ⁠◕⁠✿⁠))",
    default: "You are a helpful family assistant."
};

function getSystemPrompt(uiMode: string, contextSummary: string): string {
    const persona = PERSONAS[uiMode] || PERSONAS.default;
    return `${persona}\n\nCurrent Context:\n${contextSummary}\n\nAnswer the user's request based on this context.`;
}

function stringifyContext(context: Record<string, unknown>): string {
    // specialized stringifier if needed, or just JSON
    return JSON.stringify(context, null, 2);
}

export async function createChatResponse(
    input: string,
    options?: ChatOptions
): Promise<ChatResponse> {
    // 1. Check Mock Mode
    if (process.env.USE_MOCK_DATA === "true" && options?.forceProvider !== "ollama" && options?.forceProvider !== "openai") {
        return {
            text: `[MOCK] Response to: "${input}"`,
            provider: "mock",
            model: "mock-model",
            meta: { mocked: true }
        };
    }

    // 2. Get Context
    const snapshot = getContextSnapshot();
    const finalContext = { ...snapshot, ...(options?.contextOverride || {}) };

    // 3. Prepare Messages
    const systemPrompt = options?.systemPromptOverride || getSystemPrompt(finalContext.uiMode, stringifyContext(finalContext as any));
    const messages: Message[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
    ];

    // 4. Determine Provider Strategy
    const forceProvider = options?.forceProvider;

    if (forceProvider === "openai") {
        return await callOpenAI(messages);
    }

    if (forceProvider === "ollama") {
        return await callOllama(messages, { timeoutMs: options?.timeoutMs });
    }

    // 5. Default Routing (Ollama -> Fallback OpenAI)
    try {
        return await callOllama(messages, { timeoutMs: options?.timeoutMs });
    } catch (error) {
        console.warn("Ollama failed, falling back to OpenAI.", error);
        try {
            return await callOpenAI(messages);
        } catch (fallbackError) {
            console.error("OpenAI fallback also failed.", fallbackError);
            throw new Error("All AI providers failed.");
        }
    }
}

/**
 * LEGACY – inactive
 * Replaced by n8n pipeline as of 2025-12-20
 * Do not import in active runtime
 */
import { ContextSnapshot } from "@/lib/contracts/context";
import { createChatResponse } from "./chatOrchestrator";
import { IntentResult } from "@/lib/contracts/ai";

// Local definitions removed in favor of contracts

const CLASSIFICATION_PROMPT = `
You are an Intent Classifier. Your job is to analyze the user's input and categorize it into one of the following intents:

- smalltalk: Greetings, casual conversation, jokes (e.g. "Hi", "How are you?").
- information: General knowledge questions, asking for facts (e.g. "What is the capital of France?", "Who is Einstein?").
- planning: Brainstorming, lists, organizing events (e.g. "Plan a dinner party", "Shopping list for tacos").
- calendar_action: Requests to check calendar, add events, or reschedule (e.g. "When is my meeting?", "Add dentist tomorrow").
- explanation: Asking 'why' or 'how' about something complex (e.g. "How does gravity work?").
- unknown: If it doesn't fit any above.

Return ONLY a valid JSON object. Do not explain.
Format:
{
  "intent": "intent_name",
  "confidence": 0.0 to 1.0,
  "entities": { "date": "...", "topic": "..." } // optional extracted info
}
`;

/**
 * Classifies the user intent using a mix of deterministic rules and LLM analysis.
 */
export async function classifyIntent(
    input: string,
    context: ContextSnapshot
): Promise<IntentResult> {
    const trimmed = input.trim().toLowerCase();

    // 1. Mock Mode Fallback
    if (process.env.USE_MOCK_DATA === "true") {
        if (trimmed.includes("plan")) return { intent: "planning", confidence: 1, rawInput: input };
        if (trimmed.includes("calendar") || trimmed.includes("event")) return { intent: "calendar_action", confidence: 1, rawInput: input };
        return { intent: "smalltalk", confidence: 0.9, rawInput: input };
    }

    // 2. Deterministic Rules (Save tokens/time)
    if (["hi", "hello", "hey", "hola", "sup"].includes(trimmed)) {
        return { intent: "smalltalk", confidence: 1.0, rawInput: input };
    }

    // 3. LLM Classification for complex inputs
    try {
        const response = await createChatResponse(input, {
            systemPromptOverride: CLASSIFICATION_PROMPT,
            // Low timeout because classification should be fast. 
            // If it hangs, we'd rather fallback to unknown than wait forever.
            timeoutMs: 3000,
            contextOverride: context
        });

        const text = response.text.trim();
        // Clean up markdown code blocks if LLM adds them
        const jsonStr = text.replace(/^```json/, "").replace(/```$/, "").trim();

        const parsed = JSON.parse(jsonStr) as Partial<IntentResult>;

        return {
            intent: parsed.intent || "unknown",
            confidence: parsed.confidence || 0.5,
            entities: parsed.entities,
            rawInput: input
        };

    } catch (error) {
        console.warn("Intent classification failed or timed out:", error);
        // Fallback
        return {
            intent: "unknown",
            confidence: 0,
            rawInput: input
        };
    }
}

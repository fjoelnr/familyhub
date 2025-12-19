import { IntentResult } from '../contracts/ai';
import { ContextSnapshot } from '../contracts/context';
import { createChatResponse } from '../ai/chatOrchestrator';
import { AgentResponse } from '../contracts/agents';

const EXPLANATION_PERSONAS: Record<string, string> = {
    calm: "You are a gentle, patient tutor. Explain things simply and clearly, using calming language. Avoid harsh technical jargon unless necessary, and if so, explain it softly.",
    nerdy: "You are an enthusiastic professor who loves details! Explain the physics, history, or technical underpinnings deeply. Use analogies from science fiction where appropriate.",
    manga: "You are a senpai-style tutor! Explain things with high energy and fun analogies! Use occasional anime references or emoticons to keep it lively!!",
    default: "You are a helpful tutor explaining concepts clearly and concisely."
};

function getAudienceInstruction(intent: IntentResult): string {
    // Check if entities has audience hint
    const audience = intent.entities?.audience || intent.entities?.person; // Fallback to person if they asked "Apply to [person]"

    if (!audience) {
        return "Assume a general family audience including parents and potentially children.";
    }

    const lower = audience.toLowerCase();
    if (lower.includes('child') || lower.includes('kid') || lower.includes('eli5')) {
        return "Explain it like I am 5 years old. Use very simple analogies.";
    }
    if (lower.includes('adult') || lower.includes('parent')) {
        return "Provide a mature, well-reasoned explanation suitable for adults.";
    }

    return `Tailor your explanation for: ${audience}.`;
}

export async function processExplanationIntent(
    intent: IntentResult,
    context: ContextSnapshot
): Promise<AgentResponse> {

    const basePersona = EXPLANATION_PERSONAS[context.uiMode] || EXPLANATION_PERSONAS.default;
    const audienceInstruction = getAudienceInstruction(intent);

    const systemPrompt = `
${basePersona}
${audienceInstruction}

Current Context:
Time: ${context.time}
Date: ${context.date}

Your goal is to satisfy the user's curiosity about the topic: "${intent.rawInput}".
Do not execute any actions. Just explain.
`;

    try {
        const chatResponse = await createChatResponse(intent.rawInput, {
            systemPromptOverride: systemPrompt,
            contextOverride: context
        });

        return {
            type: 'chat',
            role: 'assistant',
            text: chatResponse.text
        };
    } catch (error) {
        console.error("Explain Agent Error:", error);
        return {
            type: 'error',
            role: 'assistant',
            text: "I couldn't come up with an explanation right now."
        };
    }
}

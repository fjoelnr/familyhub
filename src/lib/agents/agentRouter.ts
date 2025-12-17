import { IntentResult } from '../ai/intentClassifier';
import { ContextSnapshot } from '../contracts/context';
import { createChatResponse } from '../ai/chatOrchestrator';
import { processCalendarIntent, ActionResult } from './calendarAgent';
import { processExplanationIntent } from './explainAgent';

export interface AgentResponse {
    type: 'chat' | 'action_request' | 'error';
    text?: string;
    actionResult?: ActionResult;
    requiresConfirmation?: boolean;
}

export async function routeIntent(
    intent: IntentResult,
    context: ContextSnapshot
): Promise<AgentResponse> {
    try {
        // 1. Calendar Actions
        if (intent.intent === 'calendar_action') {
            const calendarResult = await processCalendarIntent(intent, context, intent.rawInput);

            // If the agent needs clarification, it's basically a chat response asking for info,
            // but we can wrap it as action_request or just chat. 
            // The requirement says "Bubble up confirmation_needed results unchanged".
            // Let's treat clarification as 'chat' for the user, but it comes from the agent.
            // Actually, if it's 'clarification_needed', the agent returns a summary text.

            if (calendarResult.status === 'clarification_needed') {
                return {
                    type: 'chat',
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }

            if (calendarResult.status === 'confirmation_needed') {
                return {
                    type: 'action_request',
                    text: calendarResult.summary,
                    actionResult: calendarResult,
                    requiresConfirmation: true
                };
            }

            if (calendarResult.status === 'success') {
                return {
                    type: 'chat', // Or action_request with auto-complete? Requirements said "Output: Unified AgentResponse".
                    // Usually a success listing is just text to show.
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }

            if (calendarResult.status === 'error') {
                return {
                    type: 'error',
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }
        }

        // 2. Explanation Agent
        if (intent.intent === 'explanation') {
            return await processExplanationIntent(intent, context);
        }

        // 3. Chat / Info / Smalltalk
        if (['smalltalk', 'information', 'planning'].includes(intent.intent)) {
            const chatResponse = await createChatResponse(intent.rawInput, {
                contextOverride: context
            });
            return {
                type: 'chat',
                text: chatResponse.text
            };
        }

        // 3. Fallback for Unknown
        // We can try to be helpful or just admit defeat.
        // Let's ask the orchestrator to handle it gracefully or return a standard message.
        // Requirement: "unknown -> fallback response with clarification"

        return {
            type: 'chat',
            text: "I'm not sure how to help with that yet. I can help with your calendar, general questions, or just chatting!"
        };

    } catch (error) {
        console.error("Agent Router Error:", error);
        return {
            type: 'error',
            text: "An internal error occurred while routing your request."
        };
    }
}

/**
 * LEGACY – inactive
 * Replaced by n8n pipeline as of 2025-12-20
 * Do not import in active runtime
 */
import { IntentResult } from '../../lib/contracts/ai';
import { ContextSnapshot } from '../../lib/contracts/context';
import { createChatResponse } from '../ai/chatOrchestrator';
import { processCalendarIntent } from './calendarAgent'; // ActionResult unused in import if we rely on contract structure, but processCalendarIntent returns it.
import { processExplanationIntent } from './explainAgent';
import { AgentResponse } from '../../lib/contracts/agents';

// We map the agent-specific results to the contract AgentResponse
export async function routeIntent(
    intent: IntentResult,
    context: ContextSnapshot,
    message: string
): Promise<AgentResponse> {
    try {
        // 1. Calendar Actions
        if (intent.intent === 'calendar_action') {
            const calendarResult = await processCalendarIntent(intent, context, message);

            if (calendarResult.status === 'clarification_needed') {
                return {
                    type: 'clarification_needed',
                    role: 'assistant',
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }

            if (calendarResult.status === 'confirmation_needed') {
                return {
                    type: 'action_request',
                    role: 'assistant',
                    text: calendarResult.summary,
                    actionResult: calendarResult,
                    requiresConfirmation: true
                };
            }

            if (calendarResult.status === 'success') {
                return {
                    type: 'chat',
                    role: 'assistant',
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }

            if (calendarResult.status === 'error') {
                return {
                    type: 'error',
                    role: 'assistant',
                    text: calendarResult.summary,
                    actionResult: calendarResult
                };
            }
        }

        // 2. Explanation Agent
        if (intent.intent === 'explanation') {
            // We assume processExplanationIntent matches or we need to wrap it.
            // Checking previous file content, it returns whatever it returns. 
            // We should probably enforce strict type here. 
            // For safety, let's wrap or trust for now, but ensure 'role' is present if missing.
            const response = await processExplanationIntent(intent, context);
            return {
                ...response,
                role: 'assistant'
            };
        }

        // 3. Chat / Info / Smalltalk
        if (['smalltalk', 'information', 'planning'].includes(intent.intent)) {
            const chatResponse = await createChatResponse(message, {
                contextOverride: context
            });
            return {
                type: 'chat',
                role: 'assistant',
                text: chatResponse.text
            };
        }

        // 4. Fallback for Unknown
        return {
            type: 'chat',
            role: 'assistant',
            text: "I'm not sure how to help with that yet. I can help with your calendar, general questions, or just chatting!"
        };

    } catch (error) {
        console.error("Agent Router Error:", error);
        return {
            type: 'error',
            role: 'assistant',
            text: "An internal error occurred while routing your request."
        };
    }
}

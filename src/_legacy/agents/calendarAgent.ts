/**
 * LEGACY – inactive
 * Replaced by n8n pipeline as of 2025-12-20
 * Do not import in active runtime
 */
import { IntentResult } from '../../lib/contracts/ai';
import { ContextSnapshot } from '../../lib/contracts/context';
import { createChatResponse } from '../ai/chatOrchestrator';
import { CalendarSync } from '../../lib/api/calendarSync';
import { CalendarEvent } from '../../lib/contracts/calendar';
import { ActionResult } from '../../lib/contracts/agents';

// Local ActionResult removed in favor of contracts

const PARSING_PROMPT = `
You are a Calendar Intent Parser. Analyze the user's input and extract structured calendar action data.

Capabilities:
1. listing: User wants to see events (e.g., "What's on today?", "Show me next week").
2. create: User wants to add an event (e.g., "Add dentist", "Meeting tomorrow at 2pm").

Current Time: {{CURRENT_TIME}}

Return ONLY a valid JSON object:
{
  "action": "listing" | "create",
  // For listing:
  "timeRange": { "start": "ISO string", "end": "ISO string" } // default to next 7 days from now if unspecified
  // For create:
  "event": {
    "title": "string or null",
    "start": "ISO string or null",
    "end": "ISO string or null", // infer duration (1h) if start is known but end is missing
    "allDay": boolean
  }
}
`;

export async function processCalendarIntent(
    intent: IntentResult,
    context: ContextSnapshot,
    userMessage: string
): Promise<ActionResult> {
    const calendarSync = new CalendarSync();

    // 0. Handle Explicit Confirmation (Bypass LLM)
    if (userMessage.startsWith("Confirm calendar event:")) {
        try {
            const json = userMessage.substring("Confirm calendar event:".length).trim();
            const payload = JSON.parse(json);
            const evt = payload as Partial<CalendarEvent>;

            await calendarSync.createEvent(evt);

            return {
                status: 'success',
                summary: `Scheduled "${evt.title}" for ${new Date(evt.start!).toLocaleString()}.`,
                payload: evt
            };
        } catch (e) {
            console.error("Confirmation parsing failed", e);
            return {
                status: 'error',
                summary: "Failed to process confirmation."
            };
        }
    }

    try {
        // 1. Parse details using LLM
        // We inject the current time into the prompt so the LLM can resolve "tomorrow", "next week", etc.
        const prompt = PARSING_PROMPT.replace('{{CURRENT_TIME}}', new Date().toISOString());

        const response = await createChatResponse(userMessage, {
            systemPromptOverride: prompt,
            contextOverride: context,
            timeoutMs: 5000 // Parsing should be relatively fast
        });

        const text = response.text.trim();
        const jsonStr = text.replace(/^```json/, "").replace(/```$/, "").trim();

        interface ParsedAction {
            action: 'listing' | 'create';
            timeRange?: { start: string; end: string };
            event?: { title: string | null; start: string | null; end: string | null; allDay: boolean };
        }

        let parsed: ParsedAction;
        try {
            parsed = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse LLM response:", text, e);
            return {
                status: 'error',
                summary: "I couldn't understand the details of your request."
            };
        }

        // 2. Handle Actions
        if (parsed.action === 'listing') {
            const start = parsed.timeRange?.start ? new Date(parsed.timeRange.start) : new Date();
            const end = parsed.timeRange?.end ? new Date(parsed.timeRange.end) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const events = await calendarSync.getEvents(start, end);

            return {
                status: 'success',
                summary: `Found ${events.length} events from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}.`,
                payload: events
            };
        }

        if (parsed.action === 'create') {
            const evt = parsed.event;
            const missing: string[] = [];

            if (!evt?.title) missing.push('title');
            if (!evt?.start) missing.push('date/time');

            if (missing.length > 0) {
                return {
                    status: 'clarification_needed',
                    summary: `I need more information to schedule that. Missing: ${missing.join(', ')}.`,
                    missingInfo: missing
                };
            }

            // If we have data, we propose it (Safety: Confirmation Needed)
            const newEvent: Partial<CalendarEvent> = {
                title: evt!.title!,
                start: evt!.start!,
                end: evt!.end || evt!.start!, // logic handled by LLM ideally, but fallback here
                allDay: evt!.allDay || false
            };

            return {
                status: 'confirmation_needed',
                summary: `I can schedule "${newEvent.title}" for ${new Date(newEvent.start!).toLocaleString()}. Should I proceed?`,
                payload: newEvent
            };
        }

        return {
            status: 'error',
            summary: "Unknown calendar action type."
        };

    } catch (error) {
        console.error("Calendar Agent Error:", error);
        return {
            status: 'error',
            summary: "Something went wrong processing your calendar request."
        };
    }
}

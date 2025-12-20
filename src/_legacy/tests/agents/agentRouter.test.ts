/**
 * LEGACY – inactive
 * Replaced by n8n pipeline as of 2025-12-20
 * Do not import in active runtime
 */
import { routeIntent } from '../../agents/agentRouter';
import { IntentResult } from '@/lib/contracts/ai';
import { ContextSnapshot } from '@/lib/contracts/context';

// Mock dependencies
jest.mock('../../ai/chatOrchestrator', () => ({
    createChatResponse: jest.fn().mockResolvedValue({ text: "Mock Chat Response" })
}));

jest.mock('../../agents/calendarAgent', () => ({
    processCalendarIntent: jest.fn()
}));

// Import mocked functions to assert on them
import { createChatResponse } from '../../ai/chatOrchestrator';
import { processCalendarIntent } from '../../agents/calendarAgent';

describe('Agent Router', () => {
    const mockContext: ContextSnapshot = {
        date: '2023-10-27',
        time: '12:00:00',
        dayPhase: 'afternoon',
        dayType: 'schoolDay',
        regionalHoliday: null,
        schoolHolidayRange: null,
        uiMode: 'calm',
        presence: { home: true }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('routes smalltalk to chat orchestrator', async () => {
        const intent: IntentResult = {
            intent: 'smalltalk',
            confidence: 0.9,
            rawInput: 'Hello'
        };

        const response = await routeIntent(intent, mockContext, intent.rawInput);

        expect(createChatResponse).toHaveBeenCalledWith('Hello', expect.objectContaining({ contextOverride: mockContext }));
        expect(response).toEqual({
            type: 'chat',
            role: 'assistant',
            text: "Mock Chat Response"
        });
    });

    it('routes calendar_action to calendar agent', async () => {
        const intent: IntentResult = {
            intent: 'calendar_action',
            confidence: 0.95,
            rawInput: 'Add event'
        };

        (processCalendarIntent as jest.Mock).mockResolvedValue({
            status: 'success',
            summary: 'Event added',
            payload: {}
        });

        const response = await routeIntent(intent, mockContext, intent.rawInput);

        expect(processCalendarIntent).toHaveBeenCalledWith(intent, mockContext, 'Add event');
        expect(response).toEqual({
            type: 'chat',
            role: 'assistant',
            text: 'Event added',
            actionResult: expect.anything()
        });
    });

    it('handles confirmation_needed from calendar agent', async () => {
        const intent: IntentResult = {
            intent: 'calendar_action',
            confidence: 1,
            rawInput: 'Add dentist'
        };

        (processCalendarIntent as jest.Mock).mockResolvedValue({
            status: 'confirmation_needed',
            summary: 'Confirm dentist?',
            payload: { title: 'dentist' }
        });

        const response = await routeIntent(intent, mockContext, intent.rawInput);

        expect(response).toEqual({
            type: 'action_request',
            role: 'assistant',
            text: 'Confirm dentist?',
            actionResult: expect.anything(),
            requiresConfirmation: true
        });
    });

    it('handles clarification_needed from calendar agent', async () => {
        const intent: IntentResult = {
            intent: 'calendar_action',
            confidence: 1,
            rawInput: 'Add event'
        };

        (processCalendarIntent as jest.Mock).mockResolvedValue({
            status: 'clarification_needed',
            summary: 'What time?',
            missingInfo: ['time']
        });

        const response = await routeIntent(intent, mockContext, intent.rawInput);

        // Clarification is treated as its own type now
        expect(response).toEqual({
            type: 'clarification_needed',
            role: 'assistant',
            text: 'What time?',
            actionResult: expect.anything()
        });
    });

    it('routes unknown intent to fallback', async () => {
        const intent: IntentResult = {
            intent: 'unknown',
            confidence: 0,
            rawInput: 'blah blah'
        };

        const response = await routeIntent(intent, mockContext, intent.rawInput);

        // Should NOT call external services for unknown (based on current simple implementation)
        expect(createChatResponse).not.toHaveBeenCalled();
        expect(processCalendarIntent).not.toHaveBeenCalled();

        expect(response.type).toBe('chat');
        expect(response.text).toContain("I'm not sure how to help");
    });
});

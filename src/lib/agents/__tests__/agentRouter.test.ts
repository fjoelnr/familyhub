import { routeIntent, AgentResponse } from '../agentRouter';
import { IntentResult } from '../../ai/intentClassifier';
import { ContextSnapshot } from '../../contracts/context';

// Mock dependencies
jest.mock('../../ai/chatOrchestrator', () => ({
    createChatResponse: jest.fn().mockResolvedValue({ text: "Mock Chat Response" })
}));

jest.mock('../calendarAgent', () => ({
    processCalendarIntent: jest.fn()
}));

// Import mocked functions to assert on them
import { createChatResponse } from '../../ai/chatOrchestrator';
import { processCalendarIntent } from '../calendarAgent';

describe('Agent Router', () => {
    const mockContext: ContextSnapshot = {
        date: '2023-10-27',
        time: '12:00:00',
        dayPhase: 'afternoon',
        dayType: 'schoolDay',
        regionalHoliday: null,
        schoolHolidayRange: null,
        uiMode: 'default',
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

        const response = await routeIntent(intent, mockContext);

        expect(createChatResponse).toHaveBeenCalledWith('Hello', expect.objectContaining({ contextOverride: mockContext }));
        expect(response).toEqual({
            type: 'chat',
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

        const response = await routeIntent(intent, mockContext);

        expect(processCalendarIntent).toHaveBeenCalledWith(intent, mockContext, 'Add event');
        expect(response).toEqual({
            type: 'chat',
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

        const response = await routeIntent(intent, mockContext);

        expect(response).toEqual({
            type: 'action_request',
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

        const response = await routeIntent(intent, mockContext);

        // Clarification is treated as a chat response (asking question)
        expect(response).toEqual({
            type: 'chat',
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

        const response = await routeIntent(intent, mockContext);

        // Should NOT call external services for unknown (based on current simple implementation)
        expect(createChatResponse).not.toHaveBeenCalled();
        expect(processCalendarIntent).not.toHaveBeenCalled();

        expect(response.type).toBe('chat');
        expect(response.text).toContain("I'm not sure how to help");
    });
});

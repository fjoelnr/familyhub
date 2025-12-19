import { processCalendarIntent } from '../calendarAgent';
import { IntentResult } from '@/lib/contracts/ai';
import { CalendarEvent } from '@/lib/contracts/calendar';
import { ContextSnapshot } from '@/lib/contracts/context';
import { CalendarSync } from '../../api/calendarSync';
import { createChatResponse } from '../../ai/chatOrchestrator';

// Mock dependencies
jest.mock('../../api/calendarSync');
jest.mock('../../ai/chatOrchestrator');

const mockCalendarSync = CalendarSync as jest.MockedClass<typeof CalendarSync>;
const mockCreateChatResponse = createChatResponse as jest.Mock;

describe('CalendarActionAgent', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        // Default Mock implementation for CalendarSync
        mockCalendarSync.prototype.getEvents.mockResolvedValue([
            { id: '1', title: 'Test Event', start: '2023-01-01', end: '2023-01-01', allDay: false, calendar: 'fam', source: 'caldav' }
        ]);
    });

    const mockContext: ContextSnapshot = {
        date: "2023-10-10",
        time: "10:00:00",
        dayPhase: "morning",
        dayType: "schoolDay", // valid literal
        regionalHoliday: null,
        schoolHolidayRange: null,
        uiMode: "calm",
        presence: { home: true }
    };

    const mockIntent: IntentResult = {
        intent: "calendar_action",
        confidence: 0.9,
        rawInput: "test input"
    };

    it('should handle "listing" action successfully', async () => {
        // Mock LLM response for listing
        mockCreateChatResponse.mockResolvedValue({
            text: JSON.stringify({
                action: 'listing',
                timeRange: { start: '2023-10-10T00:00:00Z', end: '2023-10-17T00:00:00Z' }
            })
        });

        const result = await processCalendarIntent(mockIntent, mockContext, "What's on this week?");

        expect(result.status).toBe('success');
        expect((result.payload as CalendarEvent[])).toHaveLength(1); // From our CalendarSync mock
        expect(result.summary).toContain('Found 1 events');

        // Verify dependencies called
        expect(createChatResponse).toHaveBeenCalled(); // Should be called to parse
        expect(mockCalendarSync.prototype.getEvents).toHaveBeenCalled();
    });

    it('should return "clarification_needed" if create info is missing', async () => {
        // Mock LLM response for incomplete create
        mockCreateChatResponse.mockResolvedValue({
            text: JSON.stringify({
                action: 'create',
                event: { title: null, start: null } // User just said "add event"
            })
        });

        const result = await processCalendarIntent(mockIntent, mockContext, "Add an event");

        expect(result.status).toBe('clarification_needed');
        expect(result.missingInfo).toContain('title');
        expect(result.missingInfo).toContain('date/time');
    });

    it('should return "confirmation_needed" if create info is complete', async () => {
        // Mock LLM response for complete create
        mockCreateChatResponse.mockResolvedValue({
            text: JSON.stringify({
                action: 'create',
                event: {
                    title: "Dentist",
                    start: "2023-10-11T14:00:00Z",
                    end: "2023-10-11T15:00:00Z",
                    allDay: false
                }
            })
        });

        const result = await processCalendarIntent(mockIntent, mockContext, "Dentist tomorrow at 2pm");

        expect(result.status).toBe('confirmation_needed');
        expect((result.payload as Partial<CalendarEvent>).title).toBe('Dentist');
        // Crucially, verify we did NOT call createEvent yet
        expect(mockCalendarSync.prototype.createEvent).not.toHaveBeenCalled();
    });

    it('should handle JSON parse errors gracefully', async () => {
        mockCreateChatResponse.mockResolvedValue({
            text: "This is not JSON"
        });

        const result = await processCalendarIntent(mockIntent, mockContext, "bad input");
        expect(result.status).toBe('error');
    });
});

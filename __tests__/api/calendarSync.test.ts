import { CalendarSync } from '@/lib/api/calendarSync';

const mockFetchCalendars = jest.fn();
const mockFetchCalendarObjects = jest.fn();

jest.mock('tsdav', () => ({
    createDAVClient: () => ({
        fetchCalendars: mockFetchCalendars,
        fetchCalendarObjects: mockFetchCalendarObjects,
    }),
}));

describe('CalendarSync', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.CALDAV_URL = 'http://test.com';
        process.env.CALDAV_USERNAME = 'user';
        process.env.CALDAV_PASSWORD = 'pass';
        process.env.USE_MOCK_DATA = 'false';
    });

    it('fetches events correctly using tsdav', async () => {
        mockFetchCalendars.mockResolvedValue([{
            url: '/calendars/user/default',
            displayName: 'Default'
        }]);

        const mockIcalData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:123
SUMMARY:Test Event
DTSTART;VALUE=DATE-TIME:20231026T100000Z
DTEND;VALUE=DATE-TIME:20231026T110000Z
END:VEVENT
END:VCALENDAR`;

        mockFetchCalendarObjects.mockResolvedValue([{
            url: 'event.ics',
            data: mockIcalData
        }]);

        const sync = new CalendarSync();
        const events = await sync.getEvents(new Date(), new Date());

        expect(events).toHaveLength(1);
        expect(events[0].title).toBe('Test Event');
        expect(events[0].calendar).toBe('Default');
        expect(mockFetchCalendars).toHaveBeenCalled();
        expect(mockFetchCalendarObjects).toHaveBeenCalled();
    });

    it('uses mock data when configured', async () => {
        process.env.USE_MOCK_DATA = 'true';
        const sync = new CalendarSync();
        const events = await sync.getEvents(new Date(), new Date());

        expect(events.length).toBeGreaterThan(0);
        expect(events[0].source).toBe('mock');
        expect(mockFetchCalendars).not.toHaveBeenCalled();
    });
});

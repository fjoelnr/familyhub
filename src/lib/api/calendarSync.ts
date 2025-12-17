import { CalendarEvent } from '../contracts/calendar';
import { ApiError } from '../contracts/api';
import { createDAVClient } from 'tsdav';
import ICAL from 'ical.js';

/**
 * CalendarSync service handling CalDAV operations.
 */
export class CalendarSync {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private client: any;

    constructor() {
        if (this.shouldUseRealClient()) {
            this.client = createDAVClient({
                serverUrl: process.env.CALDAV_URL!,
                credentials: {
                    username: process.env.CALDAV_USERNAME!,
                    password: process.env.CALDAV_PASSWORD!,
                },
                authMethod: 'Basic',
                defaultAccountType: 'caldav',
            });
        }
    }

    private shouldUseRealClient() {
        return (
            process.env.USE_MOCK_DATA !== 'true' &&
            !!process.env.CALDAV_URL &&
            !!process.env.CALDAV_USERNAME &&
            !!process.env.CALDAV_PASSWORD
        );
    }

    /**
     * Fetch events within a date range.
     */
    async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
        if (!this.shouldUseRealClient()) {
            return this.getMockEvents(start, end);
        }

        try {
            const calendars = await this.client.fetchCalendars();
            if (!calendars.length) return [];

            // Fetch from the first calendar for simplicity, or iterate all
            const calendar = calendars[0];

            const objects = await this.client.fetchCalendarObjects({
                calendar,
                timeRange: { start: start.toISOString(), end: end.toISOString() },
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return objects.map((obj: any) => this.parseICal(obj.data, obj.url, calendar.displayName));
        } catch (error) {
            console.error('CalDAV Error:', error);
            throw { error: 'Failed to fetch calendar events' } as ApiError;
        }
    }

    /**
     * Helper to parse iCal string to CalendarEvent
     */
    private parseICal(icalData: string, url: string, calendarName: string): CalendarEvent {
        try {
            const jcal = ICAL.parse(icalData);
            const comp = new ICAL.Component(jcal);
            const vevent = comp.getFirstSubcomponent('vevent');

            if (!vevent) throw new Error('No VEVENT found');

            const event = new ICAL.Event(vevent);

            return {
                id: url, // Use URL as ID or event.uid
                title: event.summary || 'No Title',
                start: event.startDate.toJSDate().toISOString(),
                end: event.endDate.toJSDate().toISOString(),
                allDay: event.startDate.isDate,
                calendar: calendarName,
                source: 'caldav',
                location: event.location,
                // recurrence handling would go here (rrules)
            };
        } catch (e) {
            console.error('Failed to parse iCal:', e);
            return {
                id: url,
                title: 'Error Parsing Event',
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                allDay: false,
                calendar: calendarName,
                source: 'error',
            };
        }
    }

    async createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
        if (!this.shouldUseRealClient()) {
            console.log('Mock create event:', event);
            return { ...event, id: 'mock-id' } as CalendarEvent;
        }
        throw new Error("Create not yet fully implemented for real CalDAV");
    }

    async updateEvent(id: string, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
        if (!this.shouldUseRealClient()) {
            console.log('Mock update event:', id, event);
            return { ...event, id } as CalendarEvent;
        }
        throw new Error("Update not yet fully implemented for real CalDAV");
    }

    async deleteEvent(id: string): Promise<void> {
        if (!this.shouldUseRealClient()) {
            console.log('Mock delete event:', id);
            return;
        }
        await this.client.deleteCalendarObject({ calendarObjectUrl: id });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getMockEvents(start: Date, end: Date): CalendarEvent[] {
        return [
            {
                id: '1',
                title: 'Mock Event 1',
                start: new Date().toISOString(),
                end: new Date(Date.now() + 3600000).toISOString(),
                allDay: false,
                calendar: 'Family',
                source: 'mock',
                location: 'Home',
            },
            {
                id: '2',
                title: 'Mock All Day',
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                allDay: true,
                calendar: 'Family',
                source: 'mock',
            }
        ];
    }
}

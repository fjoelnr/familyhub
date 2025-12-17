export interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    recurrence?: {
        rule: string;
        isException: boolean;
        originalId?: string;
    };
    calendar: string;
    source: string;
    location?: string;
    attendees?: string[];
    raw?: unknown;
}

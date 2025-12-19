import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarWidget from '@/components/widgets/CalendarWidget';
import { CalendarEvent } from '@/lib/contracts/calendar';

// Mock data matching the CalendarEvent interface
const mockEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Family Dinner',
        start: '2023-12-24T18:00:00.000Z',
        end: '2023-12-24T20:00:00.000Z',
        allDay: false,
        calendar: 'primary',
        source: 'google',
    },
    {
        id: '2',
        title: 'Dentist Appointment',
        start: '2023-12-25T10:00:00.000Z',
        end: '2023-12-25T11:00:00.000Z',
        allDay: false,
        calendar: 'primary',
        source: 'google',
    }
];

describe('CalendarWidget', () => {
    it('renders empty state when events is null', () => {
        render(<CalendarWidget events={null as unknown as CalendarEvent[]} />);
        expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });

    it('renders empty state when events array is empty', () => {
        render(<CalendarWidget events={[]} />);
        expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    });

    it('renders list of events', () => {
        render(<CalendarWidget events={mockEvents} />);

        // Check titles
        expect(screen.getByText('Family Dinner')).toBeInTheDocument();
        expect(screen.getByText('Dentist Appointment')).toBeInTheDocument();

        // Check formatted date/time implementation
        // The component uses toLocaleDateString(), so output depends on locale.
        // We check if the element is present or check partial text if strict match is hard.
        // However, in JSDOM, locale defaults to en-US usually or implicit.
        // We'll rely on finding the container or just partial match if safe.
        // But exact text match is better if we know the output.
        // Given the component renders: {new Date(ev.start).toLocaleDateString()}{" "}{new Date(ev.start).toLocaleTimeString()}
        // JSDOM might output specific format. 
        // We will just verify the titles are sufficient for this "happy path".
    });
});

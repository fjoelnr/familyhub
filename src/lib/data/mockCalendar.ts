export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO Date YYYY-MM-DD
    color: string;
    type?: 'holiday' | 'school' | 'family' | 'work' | 'system';
    contextTag?: string; // For Iteration 2
}

// Assessing "Today" as 2026-01-08 based on prompt context
export const mockEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Heilige Drei Könige',
        date: '2026-01-06',
        color: 'bg-green-500',
        type: 'holiday'
    },
    {
        id: 'new-1',
        title: 'Soccer Practice',
        date: '2026-01-08', // Today
        color: 'bg-orange-500',
        type: 'family',
        contextTag: 'soccer'
    },
    {
        id: 'new-2',
        title: 'Trash Pickup',
        date: '2026-01-09', // Tomorrow
        color: 'bg-gray-500',
        type: 'family'
    },
    {
        id: '2',
        title: 'Zeugnisse',
        date: '2026-01-13',
        color: 'bg-blue-600',
        type: 'school'
    },
    {
        id: '3',
        title: 'Neumond',
        date: '2026-01-18',
        color: 'bg-purple-500', // Moon phase
        type: 'system'
    },
    {
        id: '4',
        title: 'Grandma Birthday',
        date: '2026-01-24',
        color: 'bg-red-500',
        type: 'family'
    }
];

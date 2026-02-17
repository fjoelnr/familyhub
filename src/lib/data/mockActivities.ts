export interface ActivityItem {
    id: string;
    text: string;
    timestamp: string; // ISO string or relative time label
    type: 'system' | 'user' | 'calendar' | 'task';
    user?: string; // e.g. "Alex", "Mom"
    contextTag?: string; // For Iteration 2: Relationship Awareness
}

export const mockActivities: ActivityItem[] = [
    {
        id: '1',
        text: 'Alex added "Milk" to Shopping List',
        timestamp: '10 minutes ago',
        type: 'task',
        user: 'Alex'
    },
    {
        id: '2',
        text: 'Dentist appointment updated',
        timestamp: '1 hour ago',
        type: 'calendar',
        contextTag: 'busy-week'
    },
    {
        id: '3',
        text: 'Message from Dad: "I\'ll be late tonight"',
        timestamp: '2 hours ago',
        type: 'user',
        user: 'Dad'
    },
    {
        id: '4',
        text: 'Task "Water Plants" marked as done',
        timestamp: 'Yesterday',
        type: 'task',
        user: 'Mom'
    },
    {
        id: '5',
        text: 'Soccer Coach posted a new schedule',
        timestamp: '3 hours ago',
        type: 'system',
        contextTag: 'soccer'
    }
];


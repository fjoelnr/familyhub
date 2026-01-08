export interface TaskItem {
    id: string;
    text: string;
    checked: boolean;
    contextTag?: string;
}

export interface TaskList {
    id: string;
    title: string;
    color: string;
    items: TaskItem[];
}

export const mockTaskLists: TaskList[] = [
    {
        id: 'shopping',
        title: 'Einkaufen',
        color: 'bg-blue-600',
        items: [
            { id: '1', text: 'Milch', checked: false },
            { id: '2', text: 'Eier', checked: true },
            { id: '3', text: 'Brot', checked: false },
            { id: '4', text: 'Äpfel', checked: false },
        ]
    },
    {
        id: 'todo',
        title: 'Zu erledigen',
        color: 'bg-[var(--valur-red)]', // Using css variable reference or fallback
        items: [
            { id: 't1', text: 'Blumen gießen', checked: false },
            { id: 't2', text: 'Müll rausbringen', checked: false, contextTag: 'busy-week' },
            { id: 't3', text: 'Spülmaschine ausräumen', checked: true },
            { id: 't4', text: 'Wash Soccer Kit', checked: false, contextTag: 'soccer' },
        ]
    }
];

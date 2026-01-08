export interface ContextCardItem {
    id: string;
    text: string;
    type: 'pattern' | 'insight';
    relatedTags?: string[]; // Tags to highlight elsewhere
    prompt?: {
        text: string;    // Displayed on the card (e.g. "Do you want to note this?")
        question: string; // The system question injected into chat (e.g. "I noticed this pattern. Would you like to note it?")
    };
}

export const mockContextCards: ContextCardItem[] = [
    {
        id: 'ctx-1',
        text: 'This week has more calendar entries than usual.',
        type: 'pattern',
        relatedTags: ['busy-week'],
        prompt: {
            text: 'Should we prepare?',
            question: 'I noticed this week is busier than usual. Should we set aside some focus time or prepare anything specific?'
        }
    },
    {
        id: 'ctx-2',
        text: 'Several activities today involve "Soccer".',
        type: 'insight',
        relatedTags: ['soccer'],
        prompt: {
            text: 'Want to group these?',
            question: 'I see several soccer-related activities. Would you like me to group them or remind you about gear?'
        }
    }
];

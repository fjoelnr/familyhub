
import { processExplanationIntent } from '../explainAgent';
import { IntentResult } from '@/lib/ai/intentClassifier';
import { ContextSnapshot } from '@/lib/contracts/context';
import { createChatResponse } from '@/lib/ai/chatOrchestrator';

// Mock chat orchestrator
jest.mock('@/lib/ai/chatOrchestrator', () => ({
    createChatResponse: jest.fn()
}));

const mockContext: ContextSnapshot = {
    date: '2025-10-10',
    time: '12:00:00',
    dayPhase: 'afternoon',
    dayType: 'schoolDay',
    regionalHoliday: null,
    schoolHolidayRange: null,
    uiMode: 'calm',
    presence: { home: true }
};

describe('Explain Agent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should use base persona for Calm mode', async () => {
        const intent: IntentResult = {
            intent: 'explanation',
            confidence: 1,
            rawInput: 'How do rainbows work?'
        };

        (createChatResponse as jest.Mock).mockResolvedValue({
            text: 'Rainbows are beautiful arcs of light...'
        });

        const result = await processExplanationIntent(intent, mockContext);

        expect(result.type).toBe('chat');
        expect(createChatResponse).toHaveBeenCalledWith(
            intent.rawInput,
            expect.objectContaining({
                systemPromptOverride: expect.stringContaining('patient tutor') // From calm mock
            })
        );
    });

    it('should use specific persona for Nerdy mode', async () => {
        const intent: IntentResult = {
            intent: 'explanation',
            confidence: 1,
            rawInput: 'Explain quantum entanglement'
        };
        const nerdyContext = { ...mockContext, uiMode: 'nerdy' as const };

        (createChatResponse as jest.Mock).mockResolvedValue({ text: 'Quantum entanglement is...' });

        await processExplanationIntent(intent, nerdyContext);

        expect(createChatResponse).toHaveBeenCalledWith(
            intent.rawInput,
            expect.objectContaining({
                systemPromptOverride: expect.stringContaining('enthusiastic professor')
            })
        );
    });

    it('should adapt to child audience hint', async () => {
        const intent: IntentResult = {
            intent: 'explanation',
            confidence: 1,
            rawInput: 'Explain gravity to a kid',
            entities: { audience: 'kid' }
        };

        (createChatResponse as jest.Mock).mockResolvedValue({ text: 'Gravity is like a big magnet...' });

        await processExplanationIntent(intent, mockContext);

        expect(createChatResponse).toHaveBeenCalledWith(
            intent.rawInput,
            expect.objectContaining({
                systemPromptOverride: expect.stringContaining('Explain it like I am 5 years old')
            })
        );
    });

    it('should default to general family audience if no hint', async () => {
        const intent: IntentResult = {
            intent: 'explanation',
            confidence: 1,
            rawInput: 'Why is the sky blue?'
        };

        (createChatResponse as jest.Mock).mockResolvedValue({ text: 'Scattering of light...' });

        await processExplanationIntent(intent, mockContext);

        expect(createChatResponse).toHaveBeenCalledWith(
            intent.rawInput,
            expect.objectContaining({
                systemPromptOverride: expect.stringContaining('general family audience')
            })
        );
    });
});

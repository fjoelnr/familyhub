import React from 'react';
import { render } from '@testing-library/react';
import HubShell from '@/components/shell/HubShell';

import { FamilyHubProvider } from '@/lib/contexts/FamilyHubContext';
import { AgentRuntimeProvider } from '@/lib/contexts/AgentRuntimeContext';

jest.mock('@/components/zones/FluidStage', () => function MockFluidStage() {
    return <div data-testid="fluid-stage">FluidStage</div>;
});

jest.mock('@/components/zones/InputDeck', () => function MockInputDeck() {
    return <div data-testid="input-deck">InputDeck</div>;
});

describe('HubShell Snapshot', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-03-20T12:30:00.000Z'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('renders correctly', () => {
        const { container } = render(
            <FamilyHubProvider>
                <AgentRuntimeProvider>
                    <HubShell />
                </AgentRuntimeProvider>
            </FamilyHubProvider>
        );
        expect(container).toMatchSnapshot();
    });
});

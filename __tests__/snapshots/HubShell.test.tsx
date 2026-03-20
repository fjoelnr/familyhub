import React from 'react';
import { render } from '@testing-library/react';
import HubShell from '@/components/shell/HubShell';

import { FamilyHubProvider } from '@/lib/contexts/FamilyHubContext';
import { AgentRuntimeProvider } from '@/lib/contexts/AgentRuntimeContext';

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

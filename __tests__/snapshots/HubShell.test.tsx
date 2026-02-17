import React from 'react';
import { render } from '@testing-library/react';
import HubShell from '@/components/shell/HubShell';

import { FamilyHubProvider } from '@/lib/contexts/FamilyHubContext';
import { AgentRuntimeProvider } from '@/lib/contexts/AgentRuntimeContext';

describe('HubShell Snapshot', () => {
    it('renders correctly with children', () => {
        const { container } = render(
            <FamilyHubProvider>
                <AgentRuntimeProvider>
                    <HubShell>
                        <div>Test Content</div>
                    </HubShell>
                </AgentRuntimeProvider>
            </FamilyHubProvider>
        );
        expect(container).toMatchSnapshot();
    });
});

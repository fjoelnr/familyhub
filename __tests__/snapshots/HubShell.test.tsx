import React from 'react';
import { render } from '@testing-library/react';
import HubShell from '@/components/shell/HubShell';

describe('HubShell Snapshot', () => {
    it('renders correctly with children', () => {
        const { container } = render(
            <HubShell>
                <div>Test Content</div>
            </HubShell>
        );
        expect(container).toMatchSnapshot();
    });
});

import React from 'react';
import { render } from '@testing-library/react';
import { HubShell } from '@/components/shell/HubShell';

describe('HubShell Snapshot', () => {
    it('renders correctly', () => {
        const { container } = render(
            <HubShell />
        );
        expect(container).toMatchSnapshot();
    });
});

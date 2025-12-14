import React from 'react';
import { render } from '@testing-library/react';
import Section from '@/components/shell/Section';

describe('Section Snapshot', () => {
    it('renders correctly with title and children', () => {
        const { container } = render(
            <Section title="My Section Title">
                <p>Section Content</p>
            </Section>
        );
        expect(container).toMatchSnapshot();
    });
});

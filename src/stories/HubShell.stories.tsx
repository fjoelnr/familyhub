import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import HubShell from '../components/shell/HubShell';
import { FamilyHubProvider } from '../lib/contexts/FamilyHubContext';

const meta = {
    title: 'FamilyHub/HubShell',
    component: HubShell,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <FamilyHubProvider>
                <Story />
            </FamilyHubProvider>
        ),
    ],
} satisfies Meta<typeof HubShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InteractionMode: Story = {
    render: () => {
        // We can't easily force state here without refactoring Provider, 
        // but the default render allows testing via the UI.
        return <HubShell />;
    }
};

import ErrorPanel from '@/components/ErrorPanel/ErrorPanel';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof ErrorPanel> = {
  title: 'Components/Error Panel',
  component: ErrorPanel,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof ErrorPanel>;

const Template: Story = {
  render: () => (
    <div className="container">
      <div className="grid">
        <div className="span-12 md:span-8 md:start-3 lg:span-6 lg:start-4">
          <ErrorPanel message="Relax! Something went wrong!" />
        </div>
      </div>
    </div>
  ),
};

export const Default = { ...Template, args: {} };

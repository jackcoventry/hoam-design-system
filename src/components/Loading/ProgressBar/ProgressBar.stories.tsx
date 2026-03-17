import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/Loading/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Loading progress',
    min: 0,
    max: 100,
    showValue: true,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {
  args: {
    value: 42,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    label: 'Upload complete',
  },
};

export const Indeterminate: Story = {
  args: {
    value: 0,
    label: 'Importing assets',
    showValue: false,
  },
};

export const CustomValueText: Story = {
  args: {
    value: 64,
    label: 'Processing images',
    formatValueText: (percentage) => `${Math.round(percentage)} complete`,
  },
};

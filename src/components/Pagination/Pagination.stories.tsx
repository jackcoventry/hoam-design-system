import Pagination from '@/components/Pagination/Pagination';
import { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    pageCount: 6,
    currentPage: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const Template: Story = {
  render: (args) => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

export const Default = { ...Template, args: {} };

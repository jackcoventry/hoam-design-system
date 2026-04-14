import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination, type PaginationProps } from '@/components/Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    pageCount: 10,
    currentPage: 1,
    previousLabel: 'Previous page',
    nextLabel: 'Next page',
    'aria-label': 'Pagination',
    siblingCount: 1,
  },
  argTypes: {
    onPageChange: {
      control: false,
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

type InteractivePaginationProps = PaginationProps;

function InteractivePagination(args: Readonly<InteractivePaginationProps>) {
  const [currentPage, setCurrentPage] = useState(args.currentPage ?? 1);

  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractivePagination {...args} />,
};

export const ManyPages: Story = {
  args: {
    pageCount: 20,
    currentPage: 10,
    siblingCount: 1,
  },
  render: (args) => <InteractivePagination {...args} />,
};

export const WiderSiblingRange: Story = {
  args: {
    pageCount: 20,
    currentPage: 10,
    siblingCount: 2,
  },
  render: (args) => <InteractivePagination {...args} />,
};

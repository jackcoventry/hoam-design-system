import type { PaginationProps } from '@/components/Pagination';
import { Pagination } from '@/components/Pagination';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<PaginationProps> = {
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

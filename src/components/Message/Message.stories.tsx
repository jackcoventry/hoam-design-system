import type { Meta, StoryObj } from '@storybook/react-vite';

import { Message, MessageProps } from '@/components/Message';
import { log } from '@/utils/logger';

const meta = {
  title: 'Components/Message',
  component: Message,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    status: 'info',
    title: 'Info Message',
    text: 'This is an informational message.',
  },
} satisfies Meta<typeof Message>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: MessageProps) => {
  return (
    <div style={{ width: '600px' }}>
      <Message
        status={args.status}
        title={args.title}
        text={args.text}
      />
    </div>
  );
};

export const InformationMessage: Story = {
  render: Template,
  args: {},
};

export const WarningMessage: Story = {
  render: Template,
  args: {
    status: 'warning',
    title: 'Warning Message',
    text: 'This is a warning message.',
  },
};

export const ErrorMessage: Story = {
  render: Template,
  args: {
    status: 'error',
    title: 'Error Message',
    text: 'This is an error message.',
  },
};

export const SuccessMessage: Story = {
  render: Template,
  args: {
    status: 'success',
    title: 'Success Message',
    text: 'This is a success message.',
  },
};

export const Closeable: Story = {
  render: () => {
    const handleOnClose = () => {
      log('Message closed');
    };
    return (
      <div style={{ width: '600px' }}>
        <Message
          status="info"
          title="Closeable Message"
          text="This message can be closed."
          onClose={handleOnClose}
        />
      </div>
    );
  },
  args: {},
};

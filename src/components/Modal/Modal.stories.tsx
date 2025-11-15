import Modal from '@/components/Modal/Modal';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Template: Story = {
  render: () => (
    <div>
      <Modal
        isOpen
        title="Test title"
      >
        <p>Hello world</p>
      </Modal>
    </div>
  ),
};

export const Default = { ...Template, args: {} };

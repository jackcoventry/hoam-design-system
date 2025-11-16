import Modal from '@/components/Modal/Modal';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Template: Story = {
  render: (props) => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setOpen(true)}>Open modal</button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Test title"
          showTitle={props.showTitle}
          variant={props.variant}
        >
          <p>Hello world</p>
        </Modal>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
export const NoTitle = {
  ...Template,
  args: {
    showTitle: false,
  },
};
export const Drawer = {
  ...Template,
  args: {
    variant: 'drawer',
  },
};

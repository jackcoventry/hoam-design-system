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
  render: () => {
    const [openA, setOpenA] = useState(false);
    const [openB, setOpenB] = useState(false);

    return (
      <div>
        <button onClick={() => setOpenA(true)}>Open modal a</button>
        <Modal
          isOpen={openA}
          onClose={() => setOpenA(false)}
          title="Test title"
        >
          <p>Hello world</p>
        </Modal>
        <button onClick={() => setOpenB(true)}>Open modal b</button>
        <Modal
          isOpen={openB}
          onClose={() => setOpenB(false)}
          title="Test title 2"
        >
          <p>Hello world</p>
        </Modal>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };

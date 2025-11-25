import { Meta } from '@storybook/react-vite';
import React from 'react';

const meta: Meta = {
  title: 'Pages/Register',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => (
    <div className="container">
      <div className="grid">
        <div className="span-12">
          <h1>Register</h1>
        </div>
      </div>
    </div>
  ),
};

export const Default = { ...Template, args: {} };

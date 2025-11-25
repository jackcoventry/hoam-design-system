import { Meta } from '@storybook/react-vite';
import React from 'react';

const meta: Meta = {
  title: 'Pages/Account',
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
          <h1>My Account</h1>
          <h2>Welcome back!</h2>
        </div>
      </div>
    </div>
  ),
};

export const Default = { ...Template, args: {} };

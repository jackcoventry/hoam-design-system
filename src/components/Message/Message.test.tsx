import { Message } from '@/components/Message';
import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';

import { describe, expect, it, vi } from 'vitest';

describe('Message', () => {
  it('renders with required props', () => {
    const { getByRole, getByText } = render(
      <Message
        status="info"
        title="Test Title"
      />
    );
    expect(getByRole('alert')).toBeInTheDocument();
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders title in h2', () => {
    const { getByRole } = render(
      <Message
        status="info"
        title="Heading"
      />
    );
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Heading');
  });

  it('renders text when provided', () => {
    const { getByText } = render(
      <Message
        status="success"
        title="Success"
        text="Success Message"
      />
    );
    expect(getByText('Success Message')).toBeInTheDocument();
  });

  it('renders close button when onClose is provided', () => {
    const { getByRole } = render(
      <Message
        status="warning"
        title="Warning"
        onClose={() => {}}
      />
    );
    expect(getByRole('button', { name: /close message/i })).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    const { queryByRole } = render(
      <Message
        status="error"
        title="Error"
      />
    );
    expect(queryByRole('button', { name: /close message/i })).toBeNull();
  });

  it('calls onClose and hides message when close button is clicked', () => {
    const onClose = vi.fn();
    const { getByRole, container } = render(
      <Message
        status="info"
        title="Closable"
        onClose={onClose}
      />
    );
    const button = getByRole('button', { name: /close message/i });
    fireEvent.click(button);
    expect(onClose).toHaveBeenCalledTimes(1);
    // data-open should be false after close
    expect(container.querySelector('.hoam-message')?.getAttribute('data-open')).toBe('false');
  });

  it('sets data-status attribute according to status prop', () => {
    const { container } = render(
      <Message
        status="error"
        title="Error"
      />
    );
    expect(container.querySelector('.hoam-message')?.getAttribute('data-status')).toBe('error');
  });
});

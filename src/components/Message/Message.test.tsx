import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Message } from '@/components/Message';

describe('Message', () => {
  it('renders the title', () => {
    render(
      <Message
        status="info"
        title="Important update"
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Important update' })).toBeInTheDocument();
  });

  it('renders the text when provided', () => {
    render(
      <Message
        status="success"
        title="Saved"
        text="Your changes have been saved."
      />
    );

    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });

  it('does not render body text when text is not provided', () => {
    render(
      <Message
        status="warning"
        title="Heads up"
      />
    );

    expect(screen.queryByText(/heads up/i)).toBeInTheDocument();
    expect(screen.queryByText(/your changes have been saved/i)).not.toBeInTheDocument();
  });

  it('sets the status and open data attributes', () => {
    render(
      <Message
        status="error"
        title="Something went wrong"
      />
    );

    const alert = screen.getByRole('alert');

    expect(alert).toHaveAttribute('data-status', 'error');
    expect(alert).toHaveAttribute('data-open', 'true');
  });

  it('applies a custom className to the alert root', () => {
    render(
      <Message
        status="info"
        title="Styled message"
        className="custom-message"
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('custom-message');
  });

  it('renders a close button only when onClose is provided', () => {
    const { rerender } = render(
      <Message
        status="info"
        title="No close button"
      />
    );

    expect(screen.queryByRole('button', { name: 'Close message' })).not.toBeInTheDocument();

    rerender(
      <Message
        status="info"
        title="Closable"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
  });

  it('sets data-open to false when closed', async () => {
    const user = userEvent.setup();

    render(
      <Message
        status="info"
        title="Closable"
        onClose={vi.fn()}
      />
    );

    const alert = screen.getByRole('alert');
    const closeButton = screen.getByRole('button', { name: 'Close message' });

    expect(alert).toHaveAttribute('data-open', 'true');

    await user.click(closeButton);

    expect(alert).toHaveAttribute('data-open', 'false');
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Message
        status="success"
        title="Dismissible"
        onClose={onClose}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Close message' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

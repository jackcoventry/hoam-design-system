import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NewsletterBanner } from '@/components/NewsletterBanner';

describe('NewsletterBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders the title', () => {
    render(<NewsletterBanner title="Join our newsletter" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Join our newsletter' })
    ).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <NewsletterBanner
        title="Join our newsletter"
        description="Get updates, articles, and product news."
      />
    );

    expect(screen.getByText('Get updates, articles, and product news.')).toBeInTheDocument();
  });

  it('renders the subscribe button', () => {
    render(<NewsletterBanner title="Join our newsletter" />);

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('shows a validation message for an invalid email', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<NewsletterBanner title="Join our newsletter" />);

    const input = screen.getByLabelText('Email address');
    const button = screen.getByRole('button', { name: 'Subscribe' });

    await user.type(input, 'not-an-email');
    await user.click(button);

    await waitFor(() => {
      expect(input).toHaveAttribute('data-valid', 'false');
      expect(input).toHaveAttribute('placeholder', 'Please enter a valid email!');
    });
  });

  it('shows sending state and disables input during submission', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<NewsletterBanner title="Join our newsletter" />);

    const input = screen.getByLabelText('Email address');
    const button = screen.getByRole('button', { name: 'Subscribe' });

    await user.type(input, 'test@example.com');
    await user.click(button);

    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
    expect(input).toBeDisabled();

    await vi.advanceTimersByTimeAsync(2000);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
      expect(input).not.toBeDisabled();
    });
  });

  it('renders social links', () => {
    render(<NewsletterBanner title="Join our newsletter" />);

    const links = screen.getAllByRole('link');

    expect(links.length).toBeGreaterThan(0);
  });
});

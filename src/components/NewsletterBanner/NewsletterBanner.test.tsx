import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { NewsletterBanner } from '@/components/NewsletterBanner';

describe('NewsletterBanner', () => {
  afterEach(() => {
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

  it('renders the email input and subscribe button', () => {
    render(<NewsletterBanner title="Join our newsletter" />);

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('shows validation feedback for an invalid email', async () => {
    const user = userEvent.setup();

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
    vi.useFakeTimers();

    render(<NewsletterBanner title="Join our newsletter" />);

    const input = screen.getByLabelText('Email address');
    const form = input.closest('form');

    expect(form).not.toBeNull();

    fireEvent.change(input, { target: { value: 'test@example.com' } });

    await act(async () => {
      fireEvent.submit(form!);
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Sending...' })).toBeInTheDocument();
    expect(input).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    expect(input).not.toBeDisabled();
  });
});

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NewsletterBanner } from '@/components/NewsletterBanner';

// Mock the Button component used by NewsletterBanner so we get a plain <button>
vi.mock('@/components/Button/Button', () => {
  return {
    Button: ({
      children,
      className,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
      <button
        data-mock="Button"
        className={className}
        {...rest}
      >
        {children}
      </button>
    ),
  };
});

describe('NewsletterBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // needed for setTimeout in onSubmit
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderBanner = (props?: Partial<React.ComponentProps<typeof NewsletterBanner>>) =>
    render(
      <NewsletterBanner
        title="Stay in the loop"
        description="Join our newsletter for updates."
        {...props}
      />
    );

  it('renders the title and description', () => {
    renderBanner();
    expect(
      screen.getByRole('heading', { level: 2, name: /stay in the loop/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/join our newsletter for updates/i)).toBeInTheDocument();
  });

  it('renders email input with default placeholder and valid state', () => {
    renderBanner();
    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('data-valid', 'true');
    expect(input).toBeEnabled();

    const submitBtn = screen.getByRole('button', { name: /subscribe/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('shows validation error for invalid email and updates placeholder and data-valid', async () => {
    const user = userEvent.setup();
    renderBanner();

    const input = screen.getByPlaceholderText('Enter your email');

    await user.clear(input);
    await user.type(input, 'not-an-email');
    await user.tab(); // blur the input

    // The placeholder should now be the zod error message and data-valid should be false
    expect(screen.getByPlaceholderText(/please enter a valid email!/i)).toBeInTheDocument();
    expect(input).toHaveAttribute('data-valid', 'false');
  });

  it('accepts a valid email, submits, disables input, and resets after server timeout', async () => {
    const user = userEvent.setup();
    renderBanner();

    const input = screen.getByPlaceholderText('Enter your email');
    const submitBtn = screen.getByRole('button', { name: /subscribe/i });

    await user.clear(input);
    await user.type(input, 'user@example.com');
    await user.click(submitBtn);

    // Submitting state should show
    expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeInTheDocument();
    expect(input).toBeDisabled();

    // Fast-forward the fake timer (2s)
    vi.advanceTimersByTime(2000);

    // Back to idle state
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    expect(input).toBeEnabled();

    // Should remain valid and keep the neutral placeholder
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(input).toHaveAttribute('data-valid', 'true');
  });

  it('renders social links with target and rel attributes', () => {
    renderBanner();

    const socialLinksRoot = document.querySelector('.hoam-newsletter-banner__social-links');
    expect(socialLinksRoot).toBeTruthy();

    const links = within(socialLinksRoot as HTMLElement).getAllByRole('link');
    expect(links).toHaveLength(3);

    // Ensure each social link opens in a new tab with noopener
    for (const a of links) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel');
      expect(a?.getAttribute('rel')?.toLowerCase()).toContain('noopener');
    }
  });

  it('does not crash without description and still renders title/form', () => {
    renderBanner({ description: undefined });

    expect(
      screen.getByRole('heading', { level: 2, name: /stay in the loop/i })
    ).toBeInTheDocument();
    // description absent
    expect(screen.queryByText(/join our newsletter for updates/i)).not.toBeInTheDocument();

    // form bits still present
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });
});

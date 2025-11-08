import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import NotificationBar from './NotificationBar';

vi.mock('@/utils/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

// Not strictly necessary to mock these, but it keeps logs quiet
vi.mock('@/utils/clearIntervalTimeout', () => ({
  clearIntervalSafe: (ref: { current: number | null }) => {
    if (ref.current !== null) {
      clearInterval(ref.current);
      ref.current = null;
    }
  },
  clearTimeoutSafe: (ref: { current: number | null }) => {
    if (ref.current !== null) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  },
}));

const { usePrefersReducedMotion } = await import('@/utils/usePrefersReducedMotion');

const MESSAGES = [
  `Sale now on! — <a href="/sale">Take me there</a>.`,
  `Free shipping on orders over £50!`,
  `Same day shipping if ordered place before 5pm!`,
];

const INTERVAL = 5000; // interval
const FADE = 500; // fadeTime
const RESTART = 2000; // restartDelay

describe('NotificationBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (usePrefersReducedMotion as unknown as Mock).mockReturnValue(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the first message and link', () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /see status/i });
    expect(link).toHaveAttribute('href', '/status');

    // While playing, aria-live should be "polite"
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('auto-advances to the next message after the interval + fade', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });

    // message 2 should now be visible
    expect(screen.queryByRole('link', { name: /see status/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();
  });

  it('pauses on mouse enter (hover) and does not advance while paused', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );
    const region = screen.getByLabelText('Notifications');

    fireEvent.mouseEnter(region);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL * 3);
    });

    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();
  });

  it('resumes after mouse leave, but only after the restart delay', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );
    const region = screen.getByLabelText('Notifications');

    fireEvent.mouseEnter(region);
    fireEvent.mouseLeave(region);

    await act(async () => {
      vi.advanceTimersByTime(RESTART - 1);
    });
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();
  });

  it('pauses on focus and resumes after blur + restart delay', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );
    const region = screen.getByLabelText('Notifications');

    fireEvent.focus(region);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    fireEvent.blur(region);

    await act(async () => {
      vi.advanceTimersByTime(RESTART - 1);
    });
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');

    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();
  });

  it('only the currently visible message is focusable (only one link in DOM)', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();
  });

  it('with prefers-reduced-motion=true, starts paused and never auto-rotates', async () => {
    (usePrefersReducedMotion as unknown as Mock).mockReturnValue(true);

    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();
  });
});

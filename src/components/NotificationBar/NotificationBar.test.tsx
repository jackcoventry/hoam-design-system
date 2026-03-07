import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, MockInstance, vi, type Mock } from 'vitest';
import NotificationBar from './NotificationBar';

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

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

const { usePrefersReducedMotion } = await import('@/hooks/usePrefersReducedMotion');

const MESSAGE = [
  <p key="1">
    Single message — <a href="/one">one link</a>
  </p>,
];

const MESSAGES = [
  `Sale now on! — <a href="/sale">Take me there</a>.`,
  `Free shipping on orders over £50!`,
  `Same day shipping if ordered place before 5pm!`,
];

const INTERVAL = 5000; // interval
const FADE = 500; // fadeTime
const RESTART = 2000; // restartDelay

describe('NotificationBar (auto-rotates only when messages.length > 1)', () => {
  let setIntervalSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    (usePrefersReducedMotion as unknown as Mock).mockReturnValue(false);
    setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders statically with a single message: no timers, aria-live=off, no tabIndex', () => {
    render(
      <NotificationBar
        messages={MESSAGE}
        ariaLabel="Notifications"
      />
    );

    // Section is present
    const region = screen.getByLabelText('Notifications');
    expect(region).toBeInTheDocument();

    // Only one link present and it's visible
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /one link/i })).toHaveAttribute('href', '/one');

    // aria-live should be off
    const output = screen.getByRole('status');
    expect(output).toHaveAttribute('aria-live', 'off');

    // No timers scheduled (no rotation, no resume scheduler)
    expect(setIntervalSpy).not.toHaveBeenCalled();

    // Section should NOT have tabIndex attribute
    expect(region).not.toHaveAttribute('tabindex');
  });

  it('auto-rotates when there are 2+ messages (reduced motion off)', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    // Starts at first message
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    // aria-live should be polite
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');

    // Only one link
    expect(screen.getAllByRole('link')).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });

    // Now the second message is visible
    expect(screen.queryByRole('link', { name: /see status/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('pauses on hover/focus and resumes after blur/leave + restart delay', async () => {
    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );

    const region = screen.getByLabelText('Notifications');
    const status = screen.getByRole('status');

    // Pause via mouse enter
    fireEvent.mouseEnter(region);
    expect(status).toHaveAttribute('aria-live', 'off');

    act(() => {
      vi.advanceTimersByTime(INTERVAL * 2);
    });
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();

    // Schedule resume on mouse leave
    fireEvent.mouseLeave(region);

    act(() => {
      vi.advanceTimersByTime(RESTART - 1);
    });
    expect(status).toHaveAttribute('aria-live', 'off');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(status).toHaveAttribute('aria-live', 'polite');

    act(() => {
      vi.advanceTimersByTime(INTERVAL);
      vi.advanceTimersByTime(FADE);
    });
    expect(screen.getByRole('link', { name: /export data/i })).toBeInTheDocument();

    // Pause via keyboard focus
    fireEvent.focus(region);
    expect(status).toHaveAttribute('aria-live', 'off');

    // Blur + restart delay resumes
    fireEvent.blur(region);
    act(() => {
      vi.advanceTimersByTime(RESTART);
    });
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('with prefers-reduced-motion=true: does not rotate even with multiple messages; no tabIndex', async () => {
    (usePrefersReducedMotion as unknown as Mock).mockReturnValue(true);

    render(
      <NotificationBar
        messages={MESSAGES}
        ariaLabel="Notifications"
      />
    );
    const region = screen.getByLabelText('Notifications');

    // Starts paused, aria-live off
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');

    // No tabIndex when rotation is disabled
    expect(region).not.toHaveAttribute('tabindex');

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByRole('link', { name: /see status/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('does not schedule timers when messages.length is 0', async () => {
    render(
      <NotificationBar
        messages={[]}
        ariaLabel="Notifications"
      />
    );

    // when there are messages, no rotation should occur
    expect(setIntervalSpy).not.toHaveBeenCalled();

    // Output element should still be there
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
  });
});

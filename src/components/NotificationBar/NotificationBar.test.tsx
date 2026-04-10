import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationBar } from '@/components/NotificationBar';

const { mockUsePrefersReducedMotion } = vi.hoisted(() => ({
  mockUsePrefersReducedMotion: vi.fn<() => boolean>(),
}));

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: mockUsePrefersReducedMotion,
}));

describe('NotificationBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders a single message', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(<NotificationBar messages={['Hello world']} />);

    expect(screen.getByText('Hello world')).toBeInTheDocument();

    const section = screen.getByLabelText('Notifications');
    const output = screen.getByText('Hello world').closest('output');

    expect(section).not.toHaveAttribute('tabindex');
    expect(output).toHaveAttribute('aria-live', 'off');
  });

  it('renders a custom aria-label', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(
      <NotificationBar
        messages={['Hello world']}
        aria-label="Site notices"
      />
    );

    expect(screen.getByLabelText('Site notices')).toBeInTheDocument();
  });

  it('enables interactive behaviour when there are multiple messages and motion is allowed', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(<NotificationBar messages={['One', 'Two']} />);

    const section = screen.getByLabelText('Notifications');
    const output = screen.getByText('One').closest('output');

    expect(section).toHaveAttribute('tabindex', '0');
    expect(output).toHaveAttribute('aria-live', 'polite');
  });

  it('does not rotate when reduced motion is preferred', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    render(<NotificationBar messages={['One', 'Two']} />);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText('One')).toBeInTheDocument();

    const section = screen.getByLabelText('Notifications');
    const output = screen.getByText('One').closest('output');

    expect(section).not.toHaveAttribute('tabindex');
    expect(output).toHaveAttribute('aria-live', 'off');
  });

  it('rotates to the next message after the interval and fade time', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(<NotificationBar messages={['One', 'Two']} />);

    expect(screen.getByText('One')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('One')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('pauses rotation on mouse enter and resumes after mouse leave plus restart delay', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(<NotificationBar messages={['One', 'Two']} />);

    const section = screen.getByLabelText('Notifications');

    fireEvent.mouseEnter(section);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText('One')).toBeInTheDocument();

    fireEvent.mouseLeave(section);

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(screen.getByText('One')).toBeInTheDocument();

    // Resume timeout fires -> userPaused becomes false
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Let the newly-created interval elapse
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Let fade complete and index update
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('pauses rotation on focus and resumes after blur plus restart delay', () => {
    mockUsePrefersReducedMotion.mockReturnValue(false);

    render(<NotificationBar messages={['One', 'Two']} />);

    const section = screen.getByLabelText('Notifications');

    fireEvent.focus(section);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByText('One')).toBeInTheDocument();

    fireEvent.blur(section);

    // Resume timeout fires -> userPaused becomes false
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Newly-created interval runs
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Fade timeout completes
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});

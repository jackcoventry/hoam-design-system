import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NotificationBar } from './NotificationBar';

const mockUsePrefersReducedMotion = vi.fn<() => boolean>();
const clearIntervalSafeMock = vi.fn(
  (ref: { current: ReturnType<typeof globalThis.setInterval> | null } | null) => {
    if (ref?.current != null) {
      clearInterval(ref.current);
      ref.current = null;
    }
  }
);
const clearTimeoutSafeMock = vi.fn(
  (ref: { current: ReturnType<typeof globalThis.setTimeout> | null } | null) => {
    if (ref?.current != null) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  }
);

vi.mock('@/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => mockUsePrefersReducedMotion(),
}));

vi.mock('@/utils/clearIntervalTimeout', () => ({
  clearIntervalSafe: (
    ref: { current: ReturnType<typeof globalThis.setInterval> | null } | null
  ) => {
    clearIntervalSafeMock(ref);
  },
  clearTimeoutSafe: (ref: { current: ReturnType<typeof globalThis.setTimeout> | null } | null) => {
    clearTimeoutSafeMock(ref);
  },
}));

describe('NotificationBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUsePrefersReducedMotion.mockReturnValue(false);
    clearIntervalSafeMock.mockClear();
    clearTimeoutSafeMock.mockClear();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the first message', () => {
    act(() => {
      render(<NotificationBar messages={[<strong key="first">First</strong>, 'Second']} />);
    });

    const region = screen.getByLabelText('Notifications');
    const output = region.querySelector('output');

    expect(output).toBeInTheDocument();
    expect(output).toContainHTML('<strong>First</strong>');
  });

  it('renders string messages as trusted HTML', () => {
    act(() => {
      render(<NotificationBar messages={['<strong>First</strong>']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');

    expect(output).toContainHTML('<strong>First</strong>');
    expect(output?.querySelector('strong')).toHaveTextContent('First');
  });

  it('uses a custom aria-label when provided', () => {
    act(() => {
      render(
        <NotificationBar
          messages={['First']}
          aria-label="Site notifications"
        />
      );
    });

    expect(screen.getByLabelText('Site notifications')).toBeInTheDocument();
  });

  it('uses aria-live off when there is only one message', () => {
    act(() => {
      render(<NotificationBar messages={['Only one']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');
    expect(output).toHaveAttribute('aria-live', 'off');
  });

  it('uses aria-live polite when multiple messages can rotate', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');
    expect(output).toHaveAttribute('aria-live', 'polite');
  });

  it('rotates to the next message after the interval and fade time', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const region = screen.getByLabelText('Notifications');
    const output = region.querySelector('output');

    expect(output).toHaveTextContent('First');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(output).toHaveStyle({ opacity: '0' });
    expect(output?.style.transition).toBe('opacity 500ms linear');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(output).toHaveTextContent('Second');
    expect(output).toHaveStyle({ opacity: '1' });
  });

  it('wraps back to the first message after the last one', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');
    expect(output).toHaveTextContent('First');

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('Second');

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('First');
  });

  it('does not rotate when reduced motion is preferred', () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');
    expect(output).toHaveAttribute('aria-live', 'off');
    expect(output?.getAttribute('style') ?? '').toBe('');

    act(() => {
      vi.advanceTimersByTime(12000);
    });

    expect(output).toHaveTextContent('First');
  });

  it('does not rotate when there is only one message even without reduced motion', () => {
    act(() => {
      render(<NotificationBar messages={['Only one']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');

    act(() => {
      vi.advanceTimersByTime(12000);
    });

    expect(output).toHaveTextContent('Only one');
  });

  it('pauses rotation on mouse enter and resumes after mouse leave and delay', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const region = screen.getByLabelText('Notifications');
    const output = region.querySelector('output');

    act(() => {
      fireEvent.mouseEnter(region);
    });
    expect(output).toHaveAttribute('aria-live', 'off');

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(output).toHaveTextContent('First');

    act(() => {
      fireEvent.mouseLeave(region);
    });

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(output).toHaveTextContent('First');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(output).toHaveAttribute('aria-live', 'polite');

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('Second');
  });

  it('pauses rotation on focus and resumes after blur and delay', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const region = screen.getByLabelText('Notifications');
    const output = region.querySelector('output');

    act(() => {
      fireEvent.focus(region);
    });
    expect(output).toHaveAttribute('aria-live', 'off');

    act(() => {
      vi.advanceTimersByTime(7000);
    });

    expect(output).toHaveTextContent('First');

    act(() => {
      fireEvent.blur(region);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('Second');
  });

  it('resets the resume timeout if interaction happens again before resume', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const region = screen.getByLabelText('Notifications');
    const output = region.querySelector('output');

    act(() => {
      fireEvent.mouseEnter(region);
      fireEvent.mouseLeave(region);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      fireEvent.mouseEnter(region);
      fireEvent.mouseLeave(region);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(output).toHaveTextContent('First');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('Second');
  });

  it('updates to the first message if the current index would be out of bounds after rerender', () => {
    let rerender: ReturnType<typeof render>['rerender'];

    act(() => {
      ({ rerender } = render(<NotificationBar messages={['First', 'Second']} />));
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(output).toHaveTextContent('Second');

    act(() => {
      rerender(<NotificationBar messages={['Only one now']} />);
    });

    expect(output).toHaveTextContent('Only one now');
  });

  it('renders null-like current message safely as empty output', () => {
    act(() => {
      render(<NotificationBar messages={['']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');
    expect(output).toBeInTheDocument();
    expect(output).toHaveTextContent('');
  });

  it('calls cleanup helpers on unmount', () => {
    let unmount: ReturnType<typeof render>['unmount'];

    act(() => {
      ({ unmount } = render(<NotificationBar messages={['First', 'Second']} />));
    });

    act(() => {
      unmount();
    });

    expect(clearIntervalSafeMock).toHaveBeenCalled();
    expect(clearTimeoutSafeMock).toHaveBeenCalled();
  });

  it('applies fading styles only when rotation is allowed', () => {
    act(() => {
      render(<NotificationBar messages={['First', 'Second']} />);
    });

    const output = screen.getByLabelText('Notifications').querySelector('output');

    expect(output).toHaveStyle({ opacity: '1' });
    expect(output?.style.transition).toBe('opacity 500ms linear');
  });
});

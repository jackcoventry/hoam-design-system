import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type ChangeListener = () => void;

function TestHarness() {
  const reduced = usePrefersReducedMotion();

  return <div>{reduced ? 'reduced' : 'no-reduced'}</div>;
}

describe('usePrefersReducedMotion', () => {
  const originalMatchMedia = globalThis.matchMedia;

  afterEach(() => {
    vi.restoreAllMocks();

    if (originalMatchMedia) {
      globalThis.matchMedia = originalMatchMedia;
    }
  });

  it('returns false when the media query does not match', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness />);

    expect(screen.getByText('no-reduced')).toBeInTheDocument();
    expect(globalThis.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('returns true when the media query matches', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness />);

    expect(screen.getByText('reduced')).toBeInTheDocument();
  });

  it('subscribes to change events on mount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness />);

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('unsubscribes from change events on unmount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    const { unmount } = render(<TestHarness />);

    unmount();

    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when the media query match changes', () => {
    let matches = false;
    let changeListener: ChangeListener | undefined;

    const addEventListener = vi.fn((event: string, listener: ChangeListener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      addEventListener,
      removeEventListener,
    })) as typeof globalThis.matchMedia;

    render(<TestHarness />);

    expect(screen.getByText('no-reduced')).toBeInTheDocument();

    act(() => {
      matches = true;
      changeListener?.();
    });

    expect(screen.getByText('reduced')).toBeInTheDocument();
  });

  it('does not fail if addEventListener and removeEventListener are missing', () => {
    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: true,
    }) as typeof globalThis.matchMedia;

    const { unmount } = render(<TestHarness />);

    expect(screen.getByText('reduced')).toBeInTheDocument();

    expect(() => unmount()).not.toThrow();
  });
});

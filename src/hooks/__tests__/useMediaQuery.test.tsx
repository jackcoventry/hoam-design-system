import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useMediaQuery } from '@/hooks/useMediaQuery';

type MatchMediaListener = () => void;

function TestHarness({ query }: Readonly<{ query: string }>) {
  const matches = useMediaQuery(query);

  return <div>{matches ? 'matches' : 'does-not-match'}</div>;
}

describe('useMediaQuery', () => {
  const originalMatchMedia = globalThis.matchMedia;

  afterEach(() => {
    vi.restoreAllMocks();

    if (originalMatchMedia === undefined) {
      delete (globalThis as { matchMedia?: typeof globalThis.matchMedia }).matchMedia;
    } else {
      globalThis.matchMedia = originalMatchMedia;
    }
  });

  it('returns false when matchMedia is not available', () => {
    delete (globalThis as { matchMedia?: typeof globalThis.matchMedia }).matchMedia;

    render(<TestHarness query="(min-width: 768px)" />);

    expect(screen.getByText('does-not-match')).toBeInTheDocument();
  });

  it('returns the current match state from matchMedia', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness query="(min-width: 768px)" />);

    expect(screen.getByText('matches')).toBeInTheDocument();
    expect(globalThis.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('subscribes to media query changes on mount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness query="(prefers-reduced-motion: reduce)" />);

    expect(addEventListener).toHaveBeenCalledTimes(1);
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('unsubscribes from media query changes on unmount', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    const { unmount } = render(<TestHarness query="(prefers-color-scheme: dark)" />);

    unmount();

    expect(removeEventListener).toHaveBeenCalledTimes(1);
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('updates when the media query change listener fires', () => {
    let matches = false;
    let changeListener: MatchMediaListener | undefined;

    const addEventListener = vi.fn((event: string, listener: MatchMediaListener) => {
      if (event === 'change') {
        changeListener = listener;
      }
    });

    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockImplementation(() => ({
      matches,
      addEventListener,
      removeEventListener,
    })) as typeof globalThis.matchMedia;

    render(<TestHarness query="(min-width: 768px)" />);

    expect(screen.getByText('does-not-match')).toBeInTheDocument();

    act(() => {
      matches = true;
      changeListener?.();
    });

    expect(screen.getByText('matches')).toBeInTheDocument();
  });

  it('returns false when matchMedia exists but does not match', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    globalThis.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener,
      removeEventListener,
    }) as typeof globalThis.matchMedia;

    render(<TestHarness query="(max-width: 767px)" />);

    expect(screen.getByText('does-not-match')).toBeInTheDocument();
  });
});

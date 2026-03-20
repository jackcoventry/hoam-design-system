import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useMegaNavState } from '@/hooks/useNavState';

function TestHarness() {
  const {
    openIndex,
    setOpenIndex,
    openGroupId,
    setOpenGroupId,
    isKeyboarding,
    setKeyboarding,
    resetNavigation,
    handleTopNavigationOpen,
    handleAllNavigationClose,
    clearHover,
    clearLeave,
  } = useMegaNavState();

  return (
    <div>
      <div data-testid="open-index">{openIndex === null ? 'null' : String(openIndex)}</div>
      <div data-testid="open-group-id">{openGroupId ?? 'null'}</div>
      <div data-testid="is-keyboarding">{String(isKeyboarding)}</div>

      <button
        type="button"
        onClick={() => setOpenIndex(2)}
      >
        set open index
      </button>

      <button
        type="button"
        onClick={() => setOpenGroupId('coffee')}
      >
        set open group
      </button>

      <button
        type="button"
        onClick={resetNavigation}
      >
        reset navigation
      </button>

      <button
        type="button"
        onClick={setKeyboarding}
      >
        set keyboarding
      </button>

      <button
        type="button"
        onClick={() => handleTopNavigationOpen(1)}
      >
        open top nav default
      </button>

      <button
        type="button"
        onClick={() => handleTopNavigationOpen(3, 10)}
      >
        open top nav fast
      </button>

      <button
        type="button"
        onClick={() => handleAllNavigationClose()}
      >
        close all nav default
      </button>

      <button
        type="button"
        onClick={() => handleAllNavigationClose(20)}
      >
        close all nav fast
      </button>

      <button
        type="button"
        onClick={clearHover}
      >
        clear hover
      </button>

      <button
        type="button"
        onClick={clearLeave}
      >
        clear leave
      </button>
    </div>
  );
}

describe('useMegaNavState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns the default state', () => {
    render(<TestHarness />);

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('false');
  });

  it('opens top navigation after the default delay', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'open top nav default' }));

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');

    act(() => {
      vi.advanceTimersByTime(79);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('1');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
  });

  it('opens top navigation after a custom delay', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'open top nav fast' }));

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('3');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
  });

  it('clears a pending hover timer', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'open top nav default' }));
    fireEvent.click(screen.getByRole('button', { name: 'clear hover' }));

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');
  });

  it('closes all navigation after the default leave delay', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'set open index' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open group' }));

    expect(screen.getByTestId('open-index')).toHaveTextContent('2');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('coffee');

    fireEvent.click(screen.getByRole('button', { name: 'close all nav default' }));

    act(() => {
      vi.advanceTimersByTime(149);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('2');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('coffee');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
  });

  it('closes all navigation after a custom leave delay', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'close all nav fast' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open index' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open group' }));

    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
  });

  it('clears a pending leave timer', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'close all nav default' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open index' }));
    fireEvent.click(screen.getByRole('button', { name: 'clear leave' }));

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('2');
  });

  it('resets navigation immediately when resetNavigation is called', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'set open index' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open group' }));

    expect(screen.getByTestId('open-index')).toHaveTextContent('2');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('coffee');

    fireEvent.click(screen.getByRole('button', { name: 'reset navigation' }));

    expect(screen.getByTestId('open-index')).toHaveTextContent('null');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('null');
  });

  it('sets keyboarding to true and resets it after 400ms', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'set keyboarding' }));

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('true');

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('true');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('false');
  });

  it('restarts the keyboard quiet timer when setKeyboarding is called again', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'set keyboarding' }));

    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.click(screen.getByRole('button', { name: 'set keyboarding' }));

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('true');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('false');
  });

  it('does not close navigation while keyboarding is true', () => {
    render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'set open index' }));
    fireEvent.click(screen.getByRole('button', { name: 'set open group' }));
    fireEvent.click(screen.getByRole('button', { name: 'set keyboarding' }));

    expect(screen.getByTestId('is-keyboarding')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: 'close all nav default' }));

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByTestId('open-index')).toHaveTextContent('2');
    expect(screen.getByTestId('open-group-id')).toHaveTextContent('coffee');
  });

  it('cleans up pending timers on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = render(<TestHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'open top nav default' }));
    fireEvent.click(screen.getByRole('button', { name: 'close all nav default' }));
    fireEvent.click(screen.getByRole('button', { name: 'set keyboarding' }));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});

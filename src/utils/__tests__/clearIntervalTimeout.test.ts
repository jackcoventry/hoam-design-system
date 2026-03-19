import { clearIntervalSafe, clearTimeoutSafe } from '@/utils/clearIntervalTimeout';

describe('clearTimeoutSafe', () => {
  it('clears the timeout and resets the ref to null when current is set', () => {
    const timeoutId = setTimeout(() => {}, 1000);
    const ref = {
      current: timeoutId,
    };

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    clearTimeoutSafe(ref);

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
    expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
    expect(ref.current).toBeNull();

    clearTimeoutSpy.mockRestore();
  });

  it('does nothing when current is null', () => {
    const ref = {
      current: null as ReturnType<typeof globalThis.setTimeout> | null,
    };

    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

    clearTimeoutSafe(ref);

    expect(clearTimeoutSpy).not.toHaveBeenCalled();
    expect(ref.current).toBeNull();

    clearTimeoutSpy.mockRestore();
  });
});

describe('clearIntervalSafe', () => {
  it('clears the interval and resets the ref to null when current is set', () => {
    const intervalId = setInterval(() => {}, 1000);
    const ref = {
      current: intervalId,
    };

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    clearIntervalSafe(ref);

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);
    expect(ref.current).toBeNull();

    clearIntervalSpy.mockRestore();
  });

  it('does nothing when current is null', () => {
    const ref = {
      current: null as ReturnType<typeof globalThis.setInterval> | null,
    };

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

    clearIntervalSafe(ref);

    expect(clearIntervalSpy).not.toHaveBeenCalled();
    expect(ref.current).toBeNull();

    clearIntervalSpy.mockRestore();
  });
});

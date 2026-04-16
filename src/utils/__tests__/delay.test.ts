import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { delay } from '@/utils/delay';

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the specified time', async () => {
    const promise = delay(500);

    // not resolved yet
    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(499);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  it('calls setTimeout with the correct delay', () => {
    const spy = vi.spyOn(global, 'setTimeout');

    delay(300);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 300);

    spy.mockRestore();
  });

  it('resolves immediately for 0ms delay (next tick)', async () => {
    const promise = delay(0);

    let resolved = false;
    promise.then(() => {
      resolved = true;
    });

    await vi.runAllTimersAsync();

    expect(resolved).toBe(true);
  });
});

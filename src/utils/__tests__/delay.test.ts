import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { delay } from '@/utils/delay';

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    await vi.runOnlyPendingTimersAsync();
    vi.useRealTimers();
  });

  it('returns a promise', () => {
    const result = delay(1000);
    expect(result).toBeInstanceOf(Promise);
  });

  it('resolves after the specified time', async () => {
    let resolved = false;

    const promise = delay(1000).finally(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(999);
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await promise;

    expect(resolved).toBe(true);
  });

  it('resolves immediately when ms is 0', async () => {
    let resolved = false;

    const promise = delay(0).finally(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(0);
    await promise;

    expect(resolved).toBe(true);
  });

  it('passes the correct delay to setTimeout', async () => {
    const spy = vi.spyOn(globalThis, 'setTimeout');

    const promise = delay(500);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.any(Function), 500);

    await vi.runOnlyPendingTimersAsync();
    await promise;

    spy.mockRestore();
  });
});

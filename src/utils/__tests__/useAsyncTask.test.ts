import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAsyncTask } from '@/utils/useAsyncTask';

describe('useAsyncTask', () => {
  it('initialises with idle state', () => {
    const task = vi.fn((signal: AbortSignal) => {
      return Promise.resolve({ ok: true, signalAborted: signal.aborted });
    });

    const { result } = renderHook(() => useAsyncTask(task));

    expect(result.current.state).toEqual({ status: 'idle' });
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('sets loading then success for a task with no input', async () => {
    const response = { message: 'Thanks!' };

    const task = vi.fn((signal: AbortSignal) => {
      void signal;

      return new Promise<typeof response>((resolve) => {
        globalThis.setTimeout(() => {
          resolve(response);
        }, 10);
      });
    });

    const { result } = renderHook(() => useAsyncTask(task));

    let promise!: Promise<typeof response>;

    act(() => {
      promise = result.current.run();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'loading' });
    });

    await act(async () => {
      await promise;
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({
        status: 'success',
        data: response,
      });
    });

    expect(result.current.data).toEqual(response);
    expect(result.current.error).toBeNull();
    expect(result.current.isSuccess).toBe(true);
  });

  it('passes input to a task with input', async () => {
    const task = vi.fn((input: { email: string }, signal: AbortSignal) => {
      void signal;
      return Promise.resolve({ message: `Submitted ${input.email}` });
    });

    const { result } = renderHook(() => useAsyncTask(task));

    await act(async () => {
      await result.current.run({ email: 'test@example.com' });
    });

    expect(task).toHaveBeenCalledTimes(1);
    expect(task).toHaveBeenCalledWith({ email: 'test@example.com' }, expect.any(AbortSignal));

    expect(result.current.state).toEqual({
      status: 'success',
      data: { message: 'Submitted test@example.com' },
    });
  });

  it('sets error state when the task rejects with an Error', async () => {
    const error = new Error('Request failed');

    const task = vi.fn((signal: AbortSignal) => {
      void signal;
      return Promise.reject(error);
    });

    const { result } = renderHook(() => useAsyncTask(task));

    await act(async () => {
      await expect(result.current.run()).rejects.toThrow('Request failed');
    });

    expect(result.current.state.status).toBe('error');

    if (result.current.state.status === 'error') {
      expect(result.current.state.error).toBe(error);
    }

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
    expect(result.current.isIdle).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('converts non-Error rejections into an Error', async () => {
    const task = vi.fn((signal: AbortSignal) => {
      void signal;
      return Promise.reject(new Error('nope'));
    });

    const { result } = renderHook(() => useAsyncTask(task));

    await act(async () => {
      await expect(result.current.run()).rejects.toBeInstanceOf(Error);
    });

    expect(result.current.state.status).toBe('error');

    if (result.current.state.status === 'error') {
      expect(result.current.state.error).toBeInstanceOf(Error);
      expect(result.current.state.error.message).toBe('nope');
    }
  });

  it('resets back to idle', async () => {
    const task = vi.fn((signal: AbortSignal) => {
      void signal;
      return Promise.resolve({ message: 'Done' });
    });

    const { result } = renderHook(() => useAsyncTask(task));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.state).toEqual({
      status: 'success',
      data: { message: 'Done' },
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.state).toEqual({ status: 'idle' });
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('aborts the previous request when run is called again', async () => {
    const abortStates: boolean[] = [];

    const task = vi.fn(
      (input: string, signal: AbortSignal) =>
        new Promise<string>((resolve, reject) => {
          const timeoutId = globalThis.setTimeout(
            () => {
              abortStates.push(signal.aborted);

              if (signal.aborted) {
                reject(new DOMException('Aborted', 'AbortError'));
                return;
              }

              resolve(`finished:${input}`);
            },
            input === 'first' ? 50 : 10
          );

          signal.addEventListener('abort', () => {
            globalThis.clearTimeout(timeoutId);
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );

    const { result } = renderHook(() => useAsyncTask(task));

    let firstPromise!: Promise<string>;
    let secondPromise!: Promise<string>;

    act(() => {
      firstPromise = result.current.run('first');
    });

    act(() => {
      secondPromise = result.current.run('second');
    });

    await act(async () => {
      await expect(firstPromise).rejects.toThrow();
      await expect(secondPromise).resolves.toBe('finished:second');
    });

    expect(result.current.state).toEqual({
      status: 'success',
      data: 'finished:second',
    });

    expect(task).toHaveBeenCalledTimes(2);
    expect(abortStates).toEqual([false]);
  });

  it('does not leave the hook in an error state when an earlier aborted request rejects', async () => {
    const task = vi.fn(
      (input: string, signal: AbortSignal) =>
        new Promise<string>((resolve, reject) => {
          const delay = input === 'first' ? 30 : 5;

          const timeoutId = globalThis.setTimeout(() => {
            if (signal.aborted) {
              reject(new DOMException('Aborted', 'AbortError'));
              return;
            }

            resolve(input);
          }, delay);

          signal.addEventListener('abort', () => {
            globalThis.clearTimeout(timeoutId);
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );

    const { result } = renderHook(() => useAsyncTask(task));

    let firstPromise!: Promise<string>;
    let secondPromise!: Promise<string>;

    await act(async () => {
      firstPromise = result.current.run('first');
      secondPromise = result.current.run('second');

      await expect(firstPromise).rejects.toThrow();
      await expect(secondPromise).resolves.toBe('second');
    });

    expect(result.current.state).toEqual({
      status: 'success',
      data: 'second',
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isError).toBe(false);
  });
});

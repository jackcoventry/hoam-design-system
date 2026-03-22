import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useFetch, useFetchSignal } from '@/hooks/useFetch';

describe('useFetchSignal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns data after a successful request', async () => {
    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string[]>>();
    fetcher.mockImplementation(() => Promise.resolve(['one', 'two', 'three']));

    const { result } = renderHook(() => useFetchSignal<string[]>(fetcher));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(['one', 'two', 'three']);
    expect(result.current.error).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('returns an error when the request fails', async () => {
    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string[]>>();
    fetcher.mockImplementation(() => Promise.reject(new Error('Request failed')));

    const { result } = renderHook(() => useFetchSignal<string[]>(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Request failed');
  });

  it('reloads data manually', async () => {
    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string[]>>();
    fetcher.mockResolvedValueOnce(['first']);
    fetcher.mockResolvedValueOnce(['second']);

    const { result } = renderHook(() => useFetchSignal<string[]>(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(['first']);
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(['second']);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('aborts the previous request when reloading', async () => {
    const signals: AbortSignal[] = [];

    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string>>();
    fetcher.mockImplementation(
      (signal) =>
        new Promise<string>((resolve) => {
          signals.push(signal);
          setTimeout(() => {
            resolve('done');
          }, 50);
        })
    );

    const { result } = renderHook(() => useFetchSignal<string>(fetcher));

    await act(async () => {
      await result.current.reload();
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(signals[0]?.aborted).toBe(true);
    expect(signals[1]?.aborted).toBe(false);
  });

  it('converts non-Error rejections into Error objects', async () => {
    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string[]>>();
    fetcher.mockImplementation(function () {
      throw new Error('Something went wrong');
    });

    const { result } = renderHook(() => useFetchSignal<string[]>(fetcher));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Something went wrong');
  });

  it('aborts the in-flight request on unmount', () => {
    let capturedSignal: AbortSignal | undefined;

    const fetcher = vi.fn<(signal: AbortSignal) => Promise<string>>();
    fetcher.mockImplementation(
      (signal) =>
        new Promise<string>(() => {
          capturedSignal = signal;
        })
    );

    const { unmount } = renderHook(() => useFetchSignal<string>(fetcher));

    expect(capturedSignal).toBeDefined();
    expect(capturedSignal?.aborted).toBe(false);

    unmount();

    expect(capturedSignal?.aborted).toBe(true);
  });
});

describe('useFetch', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and parses JSON successfully', async () => {
    let capturedInit: RequestInit | undefined;

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation((_input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        capturedInit = init;

        return Promise.resolve({
          ok: true,
          status: 200,
          text: vi.fn().mockResolvedValue(JSON.stringify([{ id: 1, name: 'Item' }])),
        } as unknown as Response);
      });

    const { result } = renderHook(() =>
      useFetch<Array<{ id: number; name: string }>>('/api/products')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/products', expect.any(Object));
    expect(capturedInit?.signal).toBeInstanceOf(AbortSignal);

    expect(result.current.data).toEqual([{ id: 1, name: 'Item' }]);
    expect(result.current.error).toBeNull();
  });

  it('returns an error when fetch response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn(),
    } as unknown as Response);

    const { result } = renderHook(() => useFetch<unknown>('/api/products'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Request failed: 500');
  });

  it('reloads and fetches again', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify([{ id: 1 }])),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: vi.fn().mockResolvedValue(JSON.stringify([{ id: 2 }])),
      } as unknown as Response);

    const { result } = renderHook(() => useFetch<Array<{ id: number }>>('/api/products'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([{ id: 1 }]);

    await act(async () => {
      await result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual([{ id: 2 }]);
  });

  it('returns an error when JSON is invalid', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue('not json'),
    } as unknown as Response);

    const { result } = renderHook(() => useFetch<unknown>('/api/products'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
  });
});

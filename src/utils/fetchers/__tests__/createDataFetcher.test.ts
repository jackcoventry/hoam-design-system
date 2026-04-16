import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { delay } from '@/utils/delay';
import { createDataFetcher } from '@/utils/fetchers/createDataFetcher';

vi.mock('@/utils/delay', () => ({
  delay: vi.fn(),
}));

describe('createDataFetcher', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    globalThis.fetch = originalFetch;
  });

  it('returns mock data when VITE_USE_MOCK_DATA is true', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
    vi.mocked(delay).mockResolvedValue(undefined);

    const mockData = [{ id: '1' }, { id: '2' }];
    const fetcher = createDataFetcher({
      url: '/api/test',
      mockData,
    });

    const signal = new AbortController().signal;
    const result = await fetcher(signal);

    expect(delay).toHaveBeenCalledTimes(1);
    expect(delay).toHaveBeenCalledWith(300);
    expect(result).toBe(mockData);
  });

  it('uses the provided mock delay when VITE_USE_MOCK_DATA is true', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
    vi.mocked(delay).mockResolvedValue(undefined);

    const fetcher = createDataFetcher({
      url: '/api/test',
      mockData: [],
      mockDelayMs: 750,
    });

    const signal = new AbortController().signal;
    await fetcher(signal);

    expect(delay).toHaveBeenCalledWith(750);
  });

  it('throws AbortError when aborted after mock delay', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'true');
    vi.mocked(delay).mockImplementation(async () => {});

    const controller = new AbortController();
    const fetcher = createDataFetcher({
      url: '/api/test',
      mockData: [{ id: '1' }],
    });

    controller.abort();

    await expect(fetcher(controller.signal)).rejects.toThrowError(DOMException);
    await expect(fetcher(controller.signal)).rejects.toMatchObject({
      name: 'AbortError',
      message: 'Aborted',
    });
  });

  it('fetches live data when VITE_USE_MOCK_DATA is not true', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');

    const payload = [{ id: '1', label: 'One' }];
    const text = JSON.stringify(payload);

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: vi.fn().mockResolvedValue(text),
      json: vi.fn().mockResolvedValue(payload),
    }) as typeof fetch;

    const fetcher = createDataFetcher<typeof payload>({
      url: '/api/test',
      mockData: [],
    });

    const controller = new AbortController();
    const result = await fetcher(controller.signal);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', {
      signal: controller.signal,
    });
    expect(result).toEqual(payload);
    expect(delay).not.toHaveBeenCalled();
  });

  it('throws when the live response is not ok', async () => {
    vi.stubEnv('VITE_USE_MOCK_DATA', 'false');

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: vi.fn(),
      json: vi.fn(),
    }) as typeof fetch;

    const fetcher = createDataFetcher<unknown[]>({
      url: '/api/test',
      mockData: [],
    });

    const signal = new AbortController().signal;

    await expect(fetcher(signal)).rejects.toThrow('Request failed: 500');
  });
});

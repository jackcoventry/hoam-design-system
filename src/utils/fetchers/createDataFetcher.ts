import { delay } from '@/utils/delay';

type FetcherOptions<T> = {
  url: string;
  mockData: T;
  mockDelayMs?: number;
};

export function createDataFetcher<T>({
  url,
  mockData,
  mockDelayMs = 300,
}: Readonly<FetcherOptions<T>>) {
  return async (signal: AbortSignal): Promise<T> => {
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

    if (useMockData) {
      await delay(mockDelayMs);

      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      return mockData;
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const parsed = (await response.json()) as unknown;
    return parsed as T;
  };
}

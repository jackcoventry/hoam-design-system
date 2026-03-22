import { SearchFormResult } from '@/components/Form/SearchForm';
import data from '@/mocks/components/SearchResults';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getSearchResults(url: string) {
  return async (signal: AbortSignal): Promise<SearchFormResult[]> => {
    const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

    if (useMockData) {
      await delay(300);

      if (signal.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      return data;
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const text = await response.text();
    const parsed = JSON.parse(text) as unknown;

    return parsed as SearchFormResult[];
  };
}

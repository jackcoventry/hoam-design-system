import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createDataFetcher } from '@/utils/fetchers/createDataFetcher';
import { getSearchResults } from '@/utils/fetchers/getSearchResults';
import searchData from '@/mocks/components/SearchResults';

vi.mock('@/utils/fetchers/createDataFetcher', () => ({
  createDataFetcher: vi.fn(),
}));

vi.mock('@/mocks/components/SearchResults', () => ({
  default: [
    {
      id: 'search-1',
      title: 'Search Result',
      href: '/search-result',
    },
  ],
}));

describe('getSearchResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates to createDataFetcher with the search url and mock data', () => {
    const fakeFetcher = vi.fn();
    vi.mocked(createDataFetcher).mockReturnValue(fakeFetcher);

    const result = getSearchResults('/api/search');

    expect(createDataFetcher).toHaveBeenCalledTimes(1);
    expect(createDataFetcher).toHaveBeenCalledWith({
      url: '/api/search',
      mockData: searchData,
    });
    expect(result).toBe(fakeFetcher);
  });
});

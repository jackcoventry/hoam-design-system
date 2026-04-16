import type { SearchFormResult } from '@/components/Form/SearchForm';
import { createDataFetcher } from '@/utils/fetchers/createDataFetcher';
import data from '@/mocks/components/SearchResults';

export function getSearchResults(url: string) {
  return createDataFetcher<SearchFormResult[]>({
    url,
    mockData: data,
  });
}

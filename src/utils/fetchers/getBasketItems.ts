import type { BasketItemProps } from '@/components/Basket';
import { createDataFetcher } from '@/utils/fetchers/createDataFetcher';
import data from '@/mocks/components/Basket';

export function getBasketItems(url: string) {
  return createDataFetcher<BasketItemProps[]>({
    url,
    mockData: data,
  });
}

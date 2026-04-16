import { describe, expect, it, vi, beforeEach } from 'vitest';

import { getBasketItems } from '@/utils/fetchers/getBasketItems';
import { createDataFetcher } from '@/utils/fetchers/createDataFetcher';
import basketData from '@/mocks/components/Basket';

vi.mock('@/utils/fetchers/createDataFetcher', () => ({
  createDataFetcher: vi.fn(),
}));

vi.mock('@/mocks/components/Basket', () => ({
  default: [
    {
      id: 'basket-1',
      title: 'Basket Item',
      price: 10,
      quantity: 2,
    },
  ],
}));

describe('getBasketItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates to createDataFetcher with the basket url and mock data', () => {
    const fakeFetcher = vi.fn();
    vi.mocked(createDataFetcher).mockReturnValue(fakeFetcher);

    const result = getBasketItems('/api/basket');

    expect(createDataFetcher).toHaveBeenCalledTimes(1);
    expect(createDataFetcher).toHaveBeenCalledWith({
      url: '/api/basket',
      mockData: basketData,
    });
    expect(result).toBe(fakeFetcher);
  });
});

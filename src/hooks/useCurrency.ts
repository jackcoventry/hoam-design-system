import { useCallback } from 'react';

import {
  type FormatCurrencyOptions,
  formatCurrencyRangeValue,
  formatCurrencyValue,
} from '@/lib/i18n/formatting/currency';
import { useFormatting } from '@/lib/i18n/formatting/useFormatting';

export function useCurrency() {
  const { locale, currency } = useFormatting();

  const formatCurrency = useCallback(
    (value: number, options?: FormatCurrencyOptions) =>
      formatCurrencyValue(value, locale, currency, options),
    [locale, currency]
  );

  const formatCurrencyRange = useCallback(
    (min?: number, max?: number, options?: FormatCurrencyOptions) =>
      formatCurrencyRangeValue(min, max, locale, currency, options),
    [locale, currency]
  );

  return {
    locale,
    currency,
    formatCurrency,
    formatCurrencyRange,
  };
}

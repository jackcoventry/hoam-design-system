import { useMemo } from 'react';

import { useFormatting } from '@/lib/i18n/formatting/useFormatting';

export type FormatCurrencyOptions = Readonly<{
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}>;

export function useCurrency() {
  const { locale, currency } = useFormatting();

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }),
    [locale, currency]
  );

  function formatCurrency(value: number, options?: FormatCurrencyOptions): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
    }).format(value);
  }

  function formatCurrencyRange(
    min?: number,
    max?: number,
    options?: FormatCurrencyOptions
  ): string {
    const hasMin = typeof min === 'number';
    const hasMax = typeof max === 'number';

    if (hasMin && hasMax) {
      return `${formatCurrency(min, options)}–${formatCurrency(max, options)}`;
    }

    if (hasMin) {
      return formatCurrency(min, options);
    }

    if (hasMax) {
      return formatCurrency(max, options);
    }

    return '';
  }

  function getCurrencySymbol(): string {
    const parts = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).formatToParts(0);

    return parts.find((part) => part.type === 'currency')?.value ?? currency;
  }

  return {
    locale,
    currency,
    formatter,
    formatCurrency,
    formatCurrencyRange,
    getCurrencySymbol,
  };
}

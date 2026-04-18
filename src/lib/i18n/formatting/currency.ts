export type FormatCurrencyOptions = Readonly<{
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}>;

export function formatCurrencyValue(
  value: number,
  locale: string,
  currency: string,
  options?: FormatCurrencyOptions
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: options?.minimumFractionDigits,
    maximumFractionDigits: options?.maximumFractionDigits,
  }).format(value);
}

export function formatCurrencyRangeValue(
  min: number | undefined,
  max: number | undefined,
  locale: string,
  currency: string,
  options?: FormatCurrencyOptions
): string {
  const hasMin = typeof min === 'number';
  const hasMax = typeof max === 'number';

  if (hasMin && hasMax) {
    return `${formatCurrencyValue(min, locale, currency, options)}–${formatCurrencyValue(max, locale, currency, options)}`;
  }

  if (hasMin) {
    return formatCurrencyValue(min, locale, currency, options);
  }

  if (hasMax) {
    return formatCurrencyValue(max, locale, currency, options);
  }

  return '';
}

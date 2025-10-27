type Parameters = {
  value: number;
  currency?: string;
};

export function convertNumberToCurrency({ value = 0, currency = 'GBP' }: Parameters) {
  return value > 0
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency,
      }).format(value)
    : undefined;
}

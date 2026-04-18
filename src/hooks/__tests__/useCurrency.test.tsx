import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCurrency } from '@/hooks/useCurrency';
import { LibraryI18nProvider } from '@/lib/i18n/Provider';

function Consumer() {
  const { formatCurrency, formatCurrencyRange } = useCurrency();

  return (
    <>
      <div data-testid="single">
        {formatCurrency(10, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
      <div data-testid="range">
        {formatCurrencyRange(10, 100, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </div>
    </>
  );
}

describe('useCurrency', () => {
  it('formats currency using default provider values', () => {
    render(
      <LibraryI18nProvider>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('single')).toHaveTextContent('£10');
    expect(screen.getByTestId('range')).toHaveTextContent('£10–£100');
  });

  it('formats currency using supplied provider values', () => {
    render(
      <LibraryI18nProvider
        locale="en-US"
        currency="USD"
      >
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('single')).toHaveTextContent('$10');
    expect(screen.getByTestId('range')).toHaveTextContent('$10–$100');
  });
});

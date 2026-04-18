import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useFormatting } from '@/lib/i18n/formatting/useFormatting';
import { LibraryI18nProvider } from '@/lib/i18n/Provider';

function Consumer() {
  const { locale, currency } = useFormatting();

  return (
    <div>
      {locale} | {currency}
    </div>
  );
}

describe('useFormatting', () => {
  it('returns the default locale and currency when none are provided', () => {
    render(
      <LibraryI18nProvider>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-GB | GBP')).toBeInTheDocument();
  });

  it('returns the provided locale and currency', () => {
    render(
      <LibraryI18nProvider
        locale="en-US"
        currency="USD"
      >
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-US | USD')).toBeInTheDocument();
  });
});

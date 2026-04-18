import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useDate } from '@/hooks/useDate';
import { LibraryI18nProvider } from '@/lib/i18n/Provider';

function Consumer() {
  const { locale, formatDate } = useDate();

  return (
    <>
      <div data-testid="locale">{locale}</div>
      <div data-testid="formatted">{formatDate('2026-04-18', { dateStyle: 'long' })}</div>
    </>
  );
}

describe('useDate', () => {
  it('uses the default locale from the provider', () => {
    render(
      <LibraryI18nProvider>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en-GB');
    expect(screen.getByTestId('formatted')).toHaveTextContent('18 April 2026');
  });

  it('uses the provided locale from the provider', () => {
    render(
      <LibraryI18nProvider locale="en-US">
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en-US');
    expect(screen.getByTestId('formatted')).toHaveTextContent('April 18, 2026');
  });

  it('updates when locale changes', () => {
    const { rerender } = render(
      <LibraryI18nProvider locale="en-GB">
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('formatted')).toHaveTextContent('18 April 2026');

    rerender(
      <LibraryI18nProvider locale="en-US">
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByTestId('formatted')).toHaveTextContent('April 18, 2026');
  });
});

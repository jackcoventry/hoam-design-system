import { type PropsWithChildren, useMemo } from 'react';

import { deepMerge, type DeepPartial } from '@/utils/deepMerge';
import { I18nContext } from '@/lib/i18n/Context';
import { defaultMessages } from '@/lib/i18n/defaults';
import { FormattingContext } from '@/lib/i18n/formatting/Context';
import { defaultFormatting } from '@/lib/i18n/formatting/defaults';
import type { LibraryFormattingConfig } from '@/lib/i18n/formatting/types';
import type { LibraryMessages } from '@/lib/i18n/types';

export type LibraryI18nProviderProps = PropsWithChildren<{
  messages?: DeepPartial<LibraryMessages>;
  locale?: string;
  currency?: string;
}>;

export function LibraryI18nProvider({
  messages,
  locale = defaultFormatting.locale,
  currency = defaultFormatting.currency,
  children,
}: Readonly<LibraryI18nProviderProps>) {
  const value = useMemo(() => deepMerge(defaultMessages, messages), [messages]);

  const formattingValue = useMemo<LibraryFormattingConfig>(
    () => ({
      locale,
      currency,
    }),
    [locale, currency]
  );

  return (
    <FormattingContext.Provider value={formattingValue}>
      <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    </FormattingContext.Provider>
  );
}

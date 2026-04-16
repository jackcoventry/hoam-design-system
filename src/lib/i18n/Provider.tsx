import { type PropsWithChildren, useMemo } from 'react';

import { deepMerge, type DeepPartial } from '@/utils/merge';
import { I18nContext } from '@/lib/i18n/Context';
import { defaultMessages } from '@/lib/i18n/defaults';
import type { LibraryMessages } from '@/lib/i18n/types';

export type LibraryI18nProviderProps = PropsWithChildren<{
  messages?: DeepPartial<LibraryMessages>;
}>;

export function LibraryI18nProvider({ messages, children }: Readonly<LibraryI18nProviderProps>) {
  const value = useMemo(() => deepMerge(defaultMessages, messages), [messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

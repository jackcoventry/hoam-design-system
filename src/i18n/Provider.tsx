import { type PropsWithChildren, useMemo } from 'react';

import { I18nContext } from '@/i18n/Context';
import { defaultMessages } from '@/i18n/defaults';
import type { DeepPartial, LibraryMessages } from '@/i18n/types';
import { deepMerge } from '@/i18n/utils/merge';

export type LibraryI18nProviderProps = PropsWithChildren<{
  messages?: DeepPartial<LibraryMessages>;
}>;

export function LibraryI18nProvider({ messages, children }: Readonly<LibraryI18nProviderProps>) {
  const value = useMemo(() => deepMerge(defaultMessages, messages), [messages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

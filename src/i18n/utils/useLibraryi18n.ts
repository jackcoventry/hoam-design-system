import { useContext } from 'react';

import { I18nContext } from '@/i18n/Context';
import type { LibraryMessages } from '@/i18n/types';

export function useLibraryi18n(): LibraryMessages {
  return useContext(I18nContext);
}

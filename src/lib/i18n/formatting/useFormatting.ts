import { useContext } from 'react';

import { FormattingContext } from '@/lib/i18n/formatting/Context';
import type { LibraryFormattingConfig } from '@/lib/i18n/formatting/types';

export function useFormatting(): LibraryFormattingConfig {
  return useContext(FormattingContext);
}

import { useCallback } from 'react';

import {
  type FormatDateOptions,
  type FormatDateValue,
  formatDateValue,
} from '@/lib/i18n/formatting/formatDate';
import { useFormatting } from '@/lib/i18n/formatting/useFormatting';

export function useDate() {
  const { locale } = useFormatting();

  const formatDate = useCallback(
    (value: FormatDateValue, options?: FormatDateOptions): string =>
      formatDateValue(value, locale, options),
    [locale]
  );

  return {
    locale,
    formatDate,
  };
}

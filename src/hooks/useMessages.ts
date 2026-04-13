import { defaultMessages } from '@/i18n/defaults';
import type { DeepPartial, LibraryMessages } from '@/i18n/types';
import { deepMerge } from '@/i18n/utils/merge';
import { useLibraryi18n } from '@/i18n/utils/useLibraryi18n';

export function useMessages<K extends keyof LibraryMessages>(
  key: K,
  overrides?: DeepPartial<LibraryMessages[K]>
): LibraryMessages[K] {
  const messages = useLibraryi18n();

  return deepMerge(messages[key] ?? defaultMessages[key], overrides);
}

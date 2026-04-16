import { deepMerge, type DeepPartial } from '@/utils/merge';
import { defaultMessages } from '@/lib/i18n/defaults';
import type { LibraryMessages } from '@/lib/i18n/types';
import { useLibraryi18n } from '@/lib/i18n/useLibraryi18n';

export function useMessages<K extends keyof LibraryMessages>(
  key: K,
  overrides?: DeepPartial<LibraryMessages[K]>
): LibraryMessages[K] {
  const messages = useLibraryi18n();

  return deepMerge(messages[key] ?? defaultMessages[key], overrides);
}

import type { DeepPartial } from '@/i18n/types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) {
    return base;
  }

  const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const key of Object.keys(override) as Array<keyof T>) {
    const baseValue = (base as Record<string, unknown>)[key as string];
    const overrideValue = override[key];

    if (overrideValue === undefined) {
      continue;
    }

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      output[key as string] = deepMerge(baseValue, overrideValue);
      continue;
    }

    output[key as string] = overrideValue;
  }

  return output as T;
}

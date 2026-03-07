type PlainObject = Record<string, unknown>;

export function get<T = unknown>(obj: unknown, path: string): T | undefined;

export function get<T = unknown>(obj: unknown, path: string, defaultValue: T): T;

export function get<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const result = path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in (acc as PlainObject)) {
      return (acc as PlainObject)[key];
    }

    return undefined;
  }, obj);

  return (result ?? defaultValue) as T | undefined;
}

export function resolveReferences<T>(obj: T, root: unknown = obj): T {
  if (Array.isArray(obj)) {
    return (obj as unknown[]).map((item) => resolveReferences(item, root)) as T;
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: PlainObject = {};

    for (const [key, value] of Object.entries(obj as PlainObject)) {
      result[key] = resolveReferences(value, root);
    }

    return result as T;
  }

  if (typeof obj === 'string' && /^\{.+\}$/.test(obj)) {
    const path = obj.slice(1, -1);
    const value = get(root, path);
    return resolveReferences(value, root) as T;
  }

  return obj;
}

// TODO: Rewrite this in typescript

/**
 * Basic object getter using dot notation
 */
export function get(obj, path, defaultValue) {
  if (typeof path !== 'string') return defaultValue;
  return (
    path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj) ?? defaultValue
  );
}

/**
 * Resolve token references recursively
 */
export function resolveReferences(obj, root = obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveReferences(item, root));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      result[key] = resolveReferences(obj[key], root);
    }
    return result;
  }

  if (typeof obj === 'string' && /^\{.+\}$/.test(obj)) {
    const path = obj.slice(1, -1);
    const value = get(root, path);
    return resolveReferences(value, root); // in case nested references
  }

  return obj;
}

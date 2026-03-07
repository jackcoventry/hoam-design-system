import { useSyncExternalStore } from 'react';

function subscribe(query: string, onStoreChange: () => void): () => void {
  if (globalThis.matchMedia === undefined) {
    return () => {};
  }

  const mediaQueryList = globalThis.matchMedia(query);

  mediaQueryList.addEventListener('change', onStoreChange);

  return () => {
    mediaQueryList.removeEventListener('change', onStoreChange);
  };
}

function getSnapshot(query: string): boolean {
  if (globalThis.matchMedia === undefined) {
    return false;
  }

  return globalThis.matchMedia(query).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribe(query, onStoreChange),
    () => getSnapshot(query),
    getServerSnapshot
  );
}

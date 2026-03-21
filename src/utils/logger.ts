import { __DEV__ } from './env';

export function log(...args: unknown[]) {
  if (__DEV__) {
    console.log('[HOAM]', ...args);
  }
}

export function warn(message: string) {
  if (__DEV__) {
    console.warn(`[HOAM] ${message}`);
  }
}

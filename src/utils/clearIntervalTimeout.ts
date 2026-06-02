import type React from 'react';

type TimerRef<T> = React.MutableRefObject<T | null>;

export function clearTimeoutSafe(ref: TimerRef<ReturnType<typeof globalThis.setTimeout>>) {
  if (ref.current !== null) {
    globalThis.clearTimeout(ref.current);
    ref.current = null;
  }
}

export function clearIntervalSafe(ref: TimerRef<ReturnType<typeof globalThis.setInterval>>) {
  if (ref.current !== null) {
    globalThis.clearInterval(ref.current);
    ref.current = null;
  }
}

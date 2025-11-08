export function clearIntervalSafe(ref: React.RefObject<number | null>) {
  if (ref.current !== null) {
    clearInterval(ref.current);
    ref.current = null;
  }
}

export function clearTimeoutSafe(ref: React.RefObject<number | null>) {
  if (ref.current !== null) {
    clearTimeout(ref.current);
    ref.current = null;
  }
}

export function clamp(n: number, min: number, max: number) {
  if (Number.isFinite(min)) {
    n = Math.max(n, min);
  }

  if (Number.isFinite(max)) {
    n = Math.min(n, max);
  }

  return n;
}

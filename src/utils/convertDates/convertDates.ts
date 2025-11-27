export function parseLooseDate(input: string): Date | null {
  const d = new Date(input);

  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export type FormatDateValue = Date | string | number;

export type FormatDateOptions = Readonly<{
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}>;

function toDate(value: FormatDateValue): Date {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}

export function formatDateValue(
  value: FormatDateValue,
  locale: string,
  options?: FormatDateOptions
): string {
  const date = toDate(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: options?.dateStyle ?? 'medium',
    timeStyle: options?.timeStyle,
  }).format(date);
}

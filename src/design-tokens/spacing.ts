export const spacingMap = {
  'none': '0px',
  '2xs': 'var(--hoam-spacing-2xs, 4px)',
  'xs': 'var(--hoam-spacing-xs, 8px)',
  'sm': 'var(--hoam-spacing-sm, 12px)',
  'md': 'var(--hoam-spacing-md, 16px)',
  'lg': 'var(--hoam-spacing-lg, 24px)',
  'xl': 'var(--hoam-spacing-xl, 32px)',
  '2xl': 'var(--hoam-spacing-2xl, 64px)',
  '3xl': 'var(--hoam-spacing-3xl, 96px)',
  '4xl': 'var(--hoam-spacing-4xl, 128px)',
} as const;

export type Spacing = keyof typeof spacingMap;

export function mapGapToValue(gap: Spacing): string {
  return spacingMap[gap];
}

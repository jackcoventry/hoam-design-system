import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/Grid/Grid.module.css';

export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** Grid content laid out in columns. */
  children: ReactNode;
  /** Number of columns available in the grid. */
  cols?: number;
  /** Horizontal column gap token. */
  gap?: GridGap;
  /** Vertical row gap token. Defaults to `gap` when omitted. */
  rowGap?: GridGap;
};

function mapGapToVar(gap: GridGap): string {
  switch (gap) {
    case 'none':
      return '0px';
    case 'sm':
      return 'var(--hoam-spacing-2, 0.5rem)';
    case 'md':
      return 'var(--hoam-spacing-4, 1rem)';
    case 'lg':
      return 'var(--hoam-spacing-6, 1.5rem)';
    case 'xl':
      return 'var(--hoam-spacing-8, 2rem)';
    default:
      return 'var(--hoam-spacing-4, 1rem)';
  }
}

export function Grid({
  children,
  className,
  cols = 12,
  gap = 'md',
  rowGap,
  style,
  ...rest
}: Readonly<GridProps>) {
  const mergedStyle: CSSProperties = {
    ...style,
    ['--grid-cols' as keyof CSSProperties]: String(cols),
    ['--grid-gap' as keyof CSSProperties]: mapGapToVar(gap),
    ['--grid-row-gap' as keyof CSSProperties]: mapGapToVar(rowGap ?? gap),
  };

  return (
    <div
      className={clsx(styles.root, className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

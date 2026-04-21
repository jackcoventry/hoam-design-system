import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/GridItem/GridItem.module.css';

export type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  /** Content rendered inside the grid item. */
  children?: ReactNode;
  /** Default column span across all breakpoints. */
  span?: number;
  /** Column span from the small breakpoint upward. */
  spanSm?: number;
  /** Column span from the medium breakpoint upward. */
  spanMd?: number;
  /** Column span from the large breakpoint upward. */
  spanLg?: number;
  /** Column span from the extra-large breakpoint upward. */
  spanXl?: number;
  /** Default starting column. */
  start?: number;
  /** Starting column from the small breakpoint upward. */
  startSm?: number;
  /** Starting column from the medium breakpoint upward. */
  startMd?: number;
  /** Starting column from the large breakpoint upward. */
  startLg?: number;
  /** Starting column from the extra-large breakpoint upward. */
  startXl?: number;
};

export function GridItem({
  children,
  className,
  span = 12,
  spanSm,
  spanMd,
  spanLg,
  spanXl,
  start,
  startSm,
  startMd,
  startLg,
  startXl,
  style,
  ...rest
}: Readonly<GridItemProps>) {
  const resolvedSpan = span;
  const resolvedSpanSm = spanSm ?? resolvedSpan;
  const resolvedSpanMd = spanMd ?? resolvedSpanSm;
  const resolvedSpanLg = spanLg ?? resolvedSpanMd;
  const resolvedSpanXl = spanXl ?? resolvedSpanLg;

  const resolvedStart = start ?? 'auto';
  const resolvedStartSm = startSm ?? resolvedStart;
  const resolvedStartMd = startMd ?? resolvedStartSm;
  const resolvedStartLg = startLg ?? resolvedStartMd;
  const resolvedStartXl = startXl ?? resolvedStartLg;

  const mergedStyle: CSSProperties = {
    ...style,
    ['--gi-span' as keyof CSSProperties]: String(resolvedSpan),
    ['--gi-span-sm' as keyof CSSProperties]: String(resolvedSpanSm),
    ['--gi-span-md' as keyof CSSProperties]: String(resolvedSpanMd),
    ['--gi-span-lg' as keyof CSSProperties]: String(resolvedSpanLg),
    ['--gi-span-xl' as keyof CSSProperties]: String(resolvedSpanXl),
    ['--gi-start' as keyof CSSProperties]: String(resolvedStart),
    ['--gi-start-sm' as keyof CSSProperties]: String(resolvedStartSm),
    ['--gi-start-md' as keyof CSSProperties]: String(resolvedStartMd),
    ['--gi-start-lg' as keyof CSSProperties]: String(resolvedStartLg),
    ['--gi-start-xl' as keyof CSSProperties]: String(resolvedStartXl),
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

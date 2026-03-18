import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/GridItem/GridItem.module.css';

export type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  span?: number;
  spanSm?: number;
  spanMd?: number;
  spanLg?: number;
  spanXl?: number;
  start?: number;
  startSm?: number;
  startMd?: number;
  startLg?: number;
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
  ...rest
}: Readonly<GridItemProps>) {
  const style = {
    '--gi-span': String(span),
    '--gi-span-sm': spanSm ? String(spanSm) : undefined,
    '--gi-span-md': spanMd ? String(spanMd) : undefined,
    '--gi-span-lg': spanLg ? String(spanLg) : undefined,
    '--gi-span-xl': spanXl ? String(spanXl) : undefined,
    '--gi-start': start ? String(start) : undefined,
    '--gi-start-sm': startSm ? String(startSm) : undefined,
    '--gi-start-md': startMd ? String(startMd) : undefined,
    '--gi-start-lg': startLg ? String(startLg) : undefined,
    '--gi-start-xl': startXl ? String(startXl) : undefined,
  } as CSSProperties;

  return (
    <div
      className={clsx(styles.root, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

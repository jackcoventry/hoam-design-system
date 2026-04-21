import clsx from 'clsx';
import type { HTMLAttributes } from 'react';

import styles from '@/components/Loading/Skeleton/Skeleton.module.css';

export type SkeletonVariant = 'rectangular' | 'text' | 'circular';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Explicit width for the skeleton placeholder. */
  width?: number | string;
  /** Explicit height for the skeleton placeholder. */
  height?: number | string;
  /** Visual style of the placeholder. */
  variant?: SkeletonVariant;
  /** Adds custom class names to the skeleton. */
  className?: string;
}

export function Skeleton({
  width = '100%',
  height,
  variant = 'rectangular',
  className,
  style,
  ...rest
}: Readonly<SkeletonProps>) {
  const resolvedHeight =
    height ?? (variant === 'text' ? '1em' : variant === 'circular' ? '2.5rem' : '1rem');

  return (
    <span
      className={clsx(styles.root, styles[variant], className)}
      style={{
        width,
        height: resolvedHeight,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
}

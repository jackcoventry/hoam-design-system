import type { HTMLAttributes } from 'react';

import styles from './Skeleton.module.css';

export type SkeletonVariant = 'rectangular' | 'text' | 'circular';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  variant?: SkeletonVariant;
  className?: string;
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function Skeleton({
  width = '100%',
  height,
  variant = 'rectangular',
  className,
  style,
  ...rest
}: SkeletonProps) {
  const resolvedHeight =
    height ?? (variant === 'text' ? '1em' : variant === 'circular' ? '2.5rem' : '1rem');

  return (
    <span
      className={cx(styles.root, styles[variant], className)}
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

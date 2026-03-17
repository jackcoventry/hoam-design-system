import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { VisuallyHidden } from '@/components/Common/VisuallyHidden';

import styles from './Spinner.module.css';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'spinner' | 'dots';

export type SpinnerProps<T extends ElementType = 'div'> = {
  as?: T;
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  inline?: boolean;
  centered?: boolean;
  className?: string;
  ariaLive?: 'polite' | 'off';
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function Spinner<T extends ElementType = 'div'>({
  as,
  label = 'Loading',
  size = 'md',
  variant = 'spinner',
  inline = false,
  centered = false,
  className,
  ariaLive = 'polite',
  ...rest
}: SpinnerProps<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={clsx(
        styles.root,
        styles[`size-${size}`],
        inline && styles.inline,
        centered && styles.centered,
        className
      )}
      role="status"
      aria-live={ariaLive}
      {...rest}
    >
      {variant === 'spinner' ? (
        <svg
          className={styles.spinner}
          viewBox="0 0 50 50"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            className={styles.track}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
          />
          <circle
            className={styles.indicator}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span
          className={styles.dots}
          aria-hidden="true"
        >
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </span>
      )}

      <VisuallyHidden>{label}</VisuallyHidden>
    </Component>
  );
}

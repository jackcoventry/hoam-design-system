import clsx from 'clsx';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { VisuallyHidden } from '@/components/Common/VisuallyHidden';
import { useMessages } from '@/hooks/useMessages';

import styles from './Spinner.module.css';

export type SpinnerProps<T extends ElementType = 'div'> = {
  /** Element or component used to render the spinner wrapper. */
  as?: T;
  /** Accessible text announced for the loading state. */
  label?: string;
  /** Adds custom class names to the wrapper. */
  className?: string;
  /** `aria-live` politeness setting for the loading status. */
  ariaLive?: 'polite' | 'off';
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>;

export function Spinner<T extends ElementType = 'div'>({
  as,
  label,
  className,
  ariaLive = 'polite',
  ...rest
}: SpinnerProps<T>) {
  const t = useMessages('spinner');
  const Component = as ?? 'div';

  return (
    <Component
      className={clsx(styles.root, className)}
      role="status"
      aria-live={ariaLive}
      {...rest}
    >
      <span
        className={styles.spinner}
        aria-hidden="true"
      />

      <VisuallyHidden>{label ?? t.label}</VisuallyHidden>
    </Component>
  );
}

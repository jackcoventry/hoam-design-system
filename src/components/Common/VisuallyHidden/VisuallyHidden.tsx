import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './VisuallyHidden.module.css';

export type VisuallyHiddenProps<T extends ElementType = 'span'> = {
  /** Element or component used to render the hidden content wrapper. */
  as?: T;
  /** Content that remains available to assistive technology. */
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function VisuallyHidden<T extends ElementType = 'span'>({
  as,
  children,
  ...rest
}: VisuallyHiddenProps<T>) {
  const Component = as ?? 'span';

  return (
    <Component
      className={styles.visuallyHidden}
      {...rest}
    >
      {children}
    </Component>
  );
}

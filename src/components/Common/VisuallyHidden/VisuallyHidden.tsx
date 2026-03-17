import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import styles from './VisuallyHidden.module.css';

export type VisuallyHiddenProps<T extends ElementType = 'span'> = {
  as?: T;
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

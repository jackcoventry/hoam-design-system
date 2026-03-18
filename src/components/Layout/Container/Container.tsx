import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/Container/Container.module.css';

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: 'default' | 'wide' | 'narrow' | 'full';
};

export function Container({
  children,
  className,
  width = 'default',
  ...rest
}: Readonly<ContainerProps>) {
  return (
    <div
      className={clsx(styles.root, className)}
      data-width={width}
      {...rest}
    >
      {children}
    </div>
  );
}

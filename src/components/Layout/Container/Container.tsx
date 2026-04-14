import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/Container/Container.module.css';

export const ContainerWidths = ['default', 'wide', 'narrow', 'full'] as const;
export type ContainerWidth = (typeof ContainerWidths)[number];
export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: ContainerWidth;
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

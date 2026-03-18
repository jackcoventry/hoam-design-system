import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/Section/Section.module.css';

export type SectionSpace = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'section' | 'div' | 'main' | 'aside';
  space?: SectionSpace;
};

export function Section({
  children,
  className,
  as: Tag = 'section',
  space = 'xl',
  ...rest
}: Readonly<SectionProps>) {
  return (
    <Tag
      className={clsx(styles.root, className)}
      data-space={space}
      {...rest}
    >
      {children}
    </Tag>
  );
}

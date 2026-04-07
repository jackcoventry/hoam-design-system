import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

import { Spacing } from '@/design-tokens/spacing';

import styles from '@/components/Layout/Section/Section.module.css';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'section' | 'div' | 'main' | 'aside';
  space?: Spacing;
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

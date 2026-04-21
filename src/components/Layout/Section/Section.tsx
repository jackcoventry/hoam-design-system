import clsx from 'clsx';
import type { HTMLAttributes, ReactNode } from 'react';

import { Spacing } from '@/design-tokens/spacing';

import styles from '@/components/Layout/Section/Section.module.css';

export type SectionProps = HTMLAttributes<HTMLElement> & {
  /** Content wrapped by the section. */
  children: ReactNode;
  /** Semantic element used for the section wrapper. */
  as?: 'section' | 'div' | 'main' | 'aside';
  /** Vertical spacing preset applied to the section. */
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

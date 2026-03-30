import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

import styles from '@/components/Layout/Stack/Stack.module.css';

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gap?: StackGap;
  align?: 'stretch' | 'start' | 'center' | 'end';
};

function mapGapToValue(gap: StackGap): string {
  switch (gap) {
    case 'none':
      return '0px';
    case 'xs':
      return 'var(--hoam-spacing-1, 0.25rem)';
    case 'sm':
      return 'var(--hoam-spacing-2, 0.5rem)';
    case 'md':
      return 'var(--hoam-spacing-4, 1rem)';
    case 'lg':
      return 'var(--hoam-spacing-6, 1.5rem)';
    case 'xl':
      return 'var(--hoam-spacing-8, 2rem)';
    case '2xl':
      return 'var(--hoam-spacing-8, 3rem)';
    default:
      return 'var(--hoam-spacing-4, 1rem)';
  }
}

function mapAlignToValue(align: NonNullable<StackProps['align']>): string {
  switch (align) {
    case 'start':
      return 'flex-start';
    case 'center':
      return 'center';
    case 'end':
      return 'flex-end';
    case 'stretch':
    default:
      return 'stretch';
  }
}

export function Stack({
  children,
  className,
  gap = 'md',
  align = 'stretch',
  ...rest
}: Readonly<StackProps>) {
  const style = {
    '--stack-gap': mapGapToValue(gap),
    '--stack-align': mapAlignToValue(align),
  } as CSSProperties;

  return (
    <div
      className={clsx(styles.root, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

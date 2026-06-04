import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';
import clsx from 'clsx';

import { logger } from '@/utils/logger';

import styles from '@/components/BadgeList/BadgeList.module.css';

export const BadgeListVariants = ['default', 'alert', 'highlight'] as const;
export type BadgeListItemVariant = (typeof BadgeListVariants)[number];
export type BadgeListItemProps = {
  /** Visual style applied to the badge item. */
  variant: BadgeListItemVariant;
  /** Optional class applied to the badge item root. */
  className?: string;
};

export function BadgeListItem({
  children,
  variant = 'default',
  className,
}: PropsWithChildren<BadgeListItemProps>) {
  if (!children) {
    return null;
  }

  return (
    <span
      className={clsx(styles.item, className)}
      data-variant={variant}
    >
      {children}
    </span>
  );
}

export type BadgeListProps = PropsWithChildren<{
  /** Optional class applied to the badge list root. */
  className?: string;
}>;

function isBadgeListItemElement(
  child: ReactNode
): child is ReactElement<PropsWithChildren<BadgeListItemProps>> {
  return isValidElement(child) && child.type === BadgeListItem;
}

export function BadgeList({ children, className }: Readonly<BadgeListProps>) {
  const items = Children.map(children, (child) => {
    if (isBadgeListItemElement(child)) {
      return child;
    }

    logger.warn('BadgeList component only accepts children of type BadgeListItem');
    return null;
  });

  return <div className={clsx(styles.root, className)}>{items}</div>;
}

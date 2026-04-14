import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

import { logger } from '@/utils/logger';

import styles from '@/components/BadgeList/BadgeList.module.css';

export const BadgeListVariants = ['default', 'alert', 'highlight'] as const;
export type BadgeListItemVariant = (typeof BadgeListVariants)[number];
export type BadgeListItemProps = {
  variant: BadgeListItemVariant;
};

export function BadgeListItem({
  children,
  variant = 'default',
}: PropsWithChildren<BadgeListItemProps>) {
  if (!children) {
    return null;
  }

  return (
    <span
      className={styles.item}
      data-variant={variant}
    >
      {children}
    </span>
  );
}

function isBadgeListItemElement(
  child: ReactNode
): child is ReactElement<PropsWithChildren<BadgeListItemProps>> {
  return isValidElement(child) && child.type === BadgeListItem;
}

export function BadgeList({ children }: Readonly<PropsWithChildren>) {
  const items = Children.map(children, (child) => {
    if (isBadgeListItemElement(child)) {
      return child;
    }

    logger.warn('BadgeList component only accepts children of type BadgeListItem');
    return null;
  });

  return <div className={styles.root}>{items}</div>;
}

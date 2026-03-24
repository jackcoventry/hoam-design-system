import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

import { logger } from '@/utils/logger';

import styles from '@/components/BadgeList/BadgeList.module.css';

const INVALID_CHILD_MESSAGE = 'BadgeList component only accepts children of type BadgeListItem';

export type BadgeListItemProps = {
  href?: string;
  variant?: 'default' | 'alert';
};

export function BadgeListItem({
  children,
  href,
  variant = 'default',
}: PropsWithChildren<BadgeListItemProps>) {
  if (!children) {
    return null;
  }

  if (href) {
    return (
      <a
        href={href}
        className={styles.item}
        data-variant={variant}
      >
        {children}
      </a>
    );
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

    logger.warn(INVALID_CHILD_MESSAGE);
    return null;
  });

  return <div className={styles.root}>{items}</div>;
}

import {
  Children,
  isValidElement,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';

import { warn } from '@/utils/logger';

import styles from '@/components/BadgeList/BadgeList.module.css';

const INVALID_CHILD_MESSAGE = 'BadgeList component only accepts children of type BadgeListItem';

export type BadgeListItemProps = {
  href?: string;
  theme?: 'default' | 'alert';
};

export function BadgeListItem({
  children,
  href,
  theme = 'default',
}: PropsWithChildren<BadgeListItemProps>) {
  if (!children) {
    return null;
  }

  if (href) {
    return (
      <a
        href={href}
        className={styles.item}
        data-theme={theme}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      className={styles.item}
      data-theme={theme}
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

    warn(INVALID_CHILD_MESSAGE);
    return null;
  });

  return <div className={styles.root}>{items}</div>;
}

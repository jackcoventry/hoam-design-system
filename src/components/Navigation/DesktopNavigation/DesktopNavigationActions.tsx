import type { FocusEventHandler, MouseEvent, PointerEventHandler } from 'react';

import { Icon } from '@/components/Icon';
import { DesktopNavigationActionsProps, UserAction } from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/Navigation/Navigation.module.css';
import utils from '@/styles/Util.module.css';

function hasCount(count: number | undefined): count is number {
  return typeof count === 'number' && Number.isFinite(count);
}

function getVisibleCount(count: number) {
  return count > 99 ? '99+' : String(Math.max(0, count));
}

function getAccessibleLabel(label: string, count?: number) {
  return hasCount(count) ? `${label} ${Math.max(0, count)}` : undefined;
}

export function DesktopNavigationActions({
  userItems = [],
  onResetNavigation,
  onOpenSearch,
  onOpenBasket,
}: Readonly<DesktopNavigationActionsProps>) {
  const t = useMessages('navigation');
  const handleFocusCapture: FocusEventHandler<HTMLElement> = () => {
    onResetNavigation();
  };

  const handlePointerEnter: PointerEventHandler<HTMLElement> = () => {
    onResetNavigation();
  };

  const actions: Partial<Record<UserAction, (event: MouseEvent<HTMLAnchorElement>) => void>> = {
    USER_SEARCH: (event) => {
      event.preventDefault();
      onOpenSearch();
    },
    USER_BASKET: (event) => {
      event.preventDefault();
      onOpenBasket();
    },
  };

  if (userItems.length === 0) return null;

  return (
    <nav
      aria-label={t.userNavigation}
      onFocusCapture={handleFocusCapture}
      onPointerEnter={handlePointerEnter}
    >
      <ul
        className={styles.list}
        data-alignment="right"
      >
        {userItems.map((userLink) => {
          const count = userLink.count;
          const showCount = hasCount(count);

          return (
            <li
              key={userLink.id}
              className={styles.item}
            >
              <a
                href={userLink.href}
                className={styles.link}
                title={userLink.label}
                aria-label={getAccessibleLabel(userLink.label, userLink.count)}
                data-top-cyclable
                onClick={userLink.action ? actions[userLink.action] : undefined}
              >
                <span className={styles.countWrapper}>
                  <Icon id={userLink.icon as IconId} />
                  {showCount && (
                    <span
                      className={styles.count}
                      aria-hidden="true"
                    >
                      {getVisibleCount(count)}
                    </span>
                  )}
                </span>

                <span className={utils.srOnly}>{userLink.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

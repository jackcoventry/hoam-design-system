import type { FocusEventHandler, MouseEvent, PointerEventHandler } from 'react';

import { Icon } from '@/components/Icon';
import type { NavigationProps } from '@/components/Navigation/types';
import { IconId } from '@/design-tokens/icons';

import styles from '@/components/Navigation/Navigation.module.css';
import utils from '@/styles/Util.module.css';

type UserItem = NonNullable<NavigationProps['userItems']>[number];
type UserAction = NonNullable<UserItem['action']>;

export type DesktopNavigationActionsProps = {
  userItems: NavigationProps['userItems'];
  onResetNavigation: () => void;
  onOpenSearch: () => void;
  onOpenBasket: () => void;
};

export function DesktopNavigationActions({
  userItems = [],
  onResetNavigation,
  onOpenSearch,
  onOpenBasket,
}: Readonly<DesktopNavigationActionsProps>) {
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
      aria-label="User navigation"
      onFocusCapture={handleFocusCapture}
      onPointerEnter={handlePointerEnter}
    >
      <ul
        className={styles.list}
        data-alignment="right"
      >
        {userItems.map((userLink) => (
          <li
            key={userLink.id}
            className={styles.item}
          >
            <a
              href={userLink.href}
              className={styles.link}
              title={userLink.label}
              data-top-cyclable
              onClick={userLink.action ? actions[userLink.action] : undefined}
            >
              <Icon id={userLink.icon as IconId} />

              <span className={utils.srOnly}>{userLink.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

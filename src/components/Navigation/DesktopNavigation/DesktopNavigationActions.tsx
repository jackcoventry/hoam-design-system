import type { NavigationProps } from '@/components/Navigation/types/Navigation.types';
import type { FocusEventHandler, MouseEvent, PointerEventHandler } from 'react';

type UserItem = NonNullable<NavigationProps['userItems']>[number];
type UserAction = NonNullable<UserItem['action']>;

type DesktopNavigationActionsProps = {
  userItems: NavigationProps['userItems'];
  onResetNavigation: () => void;
  onOpenSearch: () => void;
  onOpenBasket: () => void;
};

export default function DesktopNavigationActions({
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
        className="hoam-navigation__list"
        data-alignment="right"
      >
        {userItems.map((userLink) => (
          <li
            key={userLink.id}
            className="hoam-navigation__item"
          >
            <a
              href={userLink.href}
              className="hoam-navigation__link"
              title={userLink.label}
              data-top-cyclable
              onClick={userLink.action ? actions[userLink.action] : undefined}
            >
              <svg
                className="icon"
                width="1.25em"
                height="1.25em"
                fill="currentColor"
                aria-hidden="true"
              >
                <use xlinkHref={`/icons/icons.svg#${userLink.icon}`} />
              </svg>
              <span className="sr-only">{userLink.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

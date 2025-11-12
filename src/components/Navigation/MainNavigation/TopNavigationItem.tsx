import { panelId, topTriggerId } from '@/components/Navigation/Navigation.types';
import React from 'react';

type TopNavigationItemProps = {
  item: { id: string; label: string; href: string; items?: any[] };
  index: number;
  isOpen: boolean;
  hasPanel: boolean;
  onFocusOpen: () => void;
  onClickToggle: () => void;
  onHoverOpen: () => void;
  children?: React.ReactNode;
};

function TopNavigationItem({
  item,
  index,
  isOpen,
  hasPanel,
  onFocusOpen,
  onClickToggle,
  onHoverOpen,
  children,
}: Readonly<TopNavigationItemProps>) {
  return (
    <li
      className="hoam-navigation__item"
      onPointerEnter={() => hasPanel && onHoverOpen()}
    >
      {hasPanel ? (
        <button
          id={topTriggerId(item.id)}
          data-top-trigger
          className="hoam-navigation__link"
          aria-expanded={isOpen}
          aria-controls={panelId(item.id)}
          onFocus={onFocusOpen}
          onClick={onClickToggle}
        >
          {item.label}
        </button>
      ) : (
        <a
          id={topTriggerId(item.id)}
          data-top-trigger
          className="hoam-navigation__link"
          href={item.href}
        >
          {item.label}
        </a>
      )}
      {children}
    </li>
  );
}

export default TopNavigationItem;

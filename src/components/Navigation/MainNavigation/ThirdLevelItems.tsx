import { groupBtnId, groupPanelId, NavItem } from '@/components/Navigation/Navigation.types';
import React from 'react';

type ThirdLevelItemsProps = {
  parent: NavItem;
  items: Array<{ id: string; label: string; href: string }>;
  open: boolean;
};

function ThirdLevelItems({ parent, items, open }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parent?.id)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(parent?.id)}
      hidden={!open}
    >
      {parent.href && (
        <a
          href={parent.href}
          data-sub-link
        >
          View all {parent.label}
        </a>
      )}
      {items.map((i) => (
        <a
          key={i.id}
          href={i.href}
          data-sub-link
          tabIndex={open ? 0 : -1}
        >
          {i.label}
        </a>
      ))}
    </div>
  );
}

export default ThirdLevelItems;

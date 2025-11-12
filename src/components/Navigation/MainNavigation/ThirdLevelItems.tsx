import { groupBtnId, groupPanelId } from '@/components/Navigation/Navigation.types';
import React from 'react';

type ThirdLevelItemsProps = {
  parentId: string;
  items: Array<{ id: string; label: string; href: string }>;
  open: boolean;
};

function ThirdLevelItems({ parentId, items, open }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parentId)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(parentId)}
      hidden={!open}
    >
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

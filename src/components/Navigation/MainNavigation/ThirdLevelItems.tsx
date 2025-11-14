import { groupBtnId, groupPanelId, NavItem } from '@/components/Navigation/Navigation.types';
import React from 'react';

type ThirdLevelItemsProps = {
  parent: NavItem;
  items: Array<{ id: string; label: string; href: string; items: Array<NavItem> }>;
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
      <div className="hoam-navigation__panel-group">
        <div className="hoam-navigation__panel-group-section">
          {parent.href && (
            <a
              href={parent.href}
              data-sub-link
              className="hoam-navigation__panel-group-header"
            >
              View {parent.label}
            </a>
          )}
        </div>

        {items.map((i) => (
          <div
            key={i.id}
            className="hoam-navigation__panel-group-section"
          >
            <a
              href={i.href}
              data-sub-link
              tabIndex={open ? 0 : -1}
              className="hoam-navigation__panel-group-header"
            >
              {i.label}
            </a>

            {i.items?.map((child) => (
              <a
                href={child.href}
                key={child.id}
                data-sub-link
              >
                {child.label}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThirdLevelItems;

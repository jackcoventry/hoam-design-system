import { groupBtnId, groupPanelId, NavItem } from '@/components/Navigation/Navigation.types';
import React from 'react';

type ThirdLevelItemsProps = {
  parent: NavItem;
  items: Array<NavItem>;
  open: boolean;
  layout?: 'list' | 'thumbnail';
};

function ThirdLevelItems({ parent, items, open, layout = 'list' }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parent?.id)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(parent?.id)}
      hidden={!open}
      data-layout={layout}
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
              {layout === 'thumbnail' && <img src={i.thumbnail} />}

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

import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import type { NavBranchItem, NavGroupItem, NavThumbnailItem } from '@/components/Navigation/types';

type ThirdLevelItemsProps = {
  group: NavGroupItem;
  open: boolean;
};

export function ThirdLevelItems({ group, open }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(group.id)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(group.id)}
      hidden={!open}
      data-layout={group.layout}
    >
      <div className="hoam-navigation__panel-group">
        {group.layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              <div className="span-12">
                <div className="hoam-navigation__panel-group-section">
                  {group.href ? (
                    <a
                      href={group.href}
                      data-sub-link
                      className="hoam-navigation__panel-group-header"
                    >
                      {group.label}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid">
              {group.items.map((item: NavThumbnailItem) => (
                <div
                  className="span-12 md:span-4"
                  key={item.id}
                >
                  <div className="hoam-navigation__panel-group-section">
                    <a
                      href={item.href}
                      data-sub-link
                      tabIndex={open ? 0 : -1}
                      className="hoam-navigation__panel-group-header"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.label}
                      />
                      {item.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="hoam-navigation__panel-group-section">
              {group.href ? (
                <a
                  href={group.href}
                  data-sub-link
                  className="hoam-navigation__panel-group-header"
                >
                  {group.label}
                </a>
              ) : null}
            </div>

            {group.items.map((item: NavBranchItem) => (
              <div
                key={item.id}
                className="hoam-navigation__panel-group-section"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    data-sub-link
                    tabIndex={open ? 0 : -1}
                    className="hoam-navigation__panel-group-header"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="hoam-navigation__panel-group-header">{item.label}</span>
                )}

                {item.items.map((child) => (
                  <a
                    href={child.href}
                    key={child.id}
                    data-sub-link
                    tabIndex={open ? 0 : -1}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

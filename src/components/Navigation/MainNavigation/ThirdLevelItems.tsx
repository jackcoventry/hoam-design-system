import styles from '@/components/Navigation/Navigation.module.css';
import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import type { NavBranchItem, NavGroupItem, NavigationLayout } from '@/components/Navigation/types';

export type ThirdLevelItemsProps = {
  parent: NavGroupItem;
  items: NavBranchItem[];
  open: boolean;
  layout?: NavigationLayout;
};

export function ThirdLevelItems({
  parent,
  items,
  open,
  layout = 'list',
}: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parent.id)}
      className={styles.panelSubLevel}
      aria-labelledby={groupBtnId(parent.id)}
      hidden={!open}
      data-layout={layout}
    >
      <div className={styles.panelGroup}>
        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              <div className="span-12">
                <div className={styles.panelGroupSection}>
                  {parent.href ? (
                    <a
                      href={parent.href}
                      data-sub-link
                      className={styles.panelGroupHeader}
                    >
                      {parent.label}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.panelGroupSection}>
            {parent.href ? (
              <a
                href={parent.href}
                data-sub-link
                className={styles.panelGroupHeader}
              >
                {parent.label}
              </a>
            ) : null}
          </div>
        )}

        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              {items.map((item) => (
                <div
                  className="span-12 md:span-4"
                  key={item.id}
                >
                  <div className={styles.panelGroupSection}>
                    {item.href ? (
                      <a
                        href={item.href}
                        data-sub-link
                        tabIndex={open ? 0 : -1}
                        className={styles.panelGroupHeader}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className={styles.panelGroupHeader}>{item.label}</span>
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
                </div>
              ))}
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={styles.panelGroupSection}
            >
              {item.href ? (
                <a
                  href={item.href}
                  data-sub-link
                  tabIndex={open ? 0 : -1}
                  className={styles.panelGroupHeader}
                >
                  {item.label}
                </a>
              ) : (
                <span className={styles.panelGroupHeader}>{item.label}</span>
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
          ))
        )}
      </div>
    </div>
  );
}

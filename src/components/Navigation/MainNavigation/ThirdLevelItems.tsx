import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import type { NavBranchItem, NavGroupItem, NavThumbnailItem } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

type ThirdLevelItemsProps = {
  group: NavGroupItem;
  open: boolean;
};

export function ThirdLevelItems({ group, open }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(group.id)}
      className={styles.panelSubLevel}
      aria-labelledby={groupBtnId(group.id)}
      hidden={!open}
      data-layout={group.layout}
    >
      <div className={styles.panelGroup}>
        {group.layout === 'thumbnail' ? (
          <>
            <div className={styles.panelGroupSection}>
              {group.href ? (
                <a
                  href={group.href}
                  data-sub-link
                >
                  {group.label}
                </a>
              ) : null}
            </div>

            <div className={styles.panelGroupSectionGrid}>
              {group.items.map((item: NavThumbnailItem) => (
                <div key={item.id}>
                  <div className={styles.panelGroupSection}>
                    <a
                      href={item.href}
                      data-sub-link
                      tabIndex={open ? 0 : -1}
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
          </>
        ) : (
          <>
            <div className={styles.panelGroupSection}>
              {group.href ? (
                <a
                  href={group.href}
                  data-sub-link
                >
                  {group.label}
                </a>
              ) : null}
            </div>

            {group.items.map((item: NavBranchItem) => (
              <div
                key={item.id}
                className={styles.panelGroupSection}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    data-sub-link
                    tabIndex={open ? 0 : -1}
                    className={styles.panelGroupHeaderFirst}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className={styles.panelGroupHeaderFirst}>{item.label}</span>
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

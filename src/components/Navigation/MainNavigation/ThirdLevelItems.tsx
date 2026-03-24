import { Container, Grid, GridItem } from '@/components/Layout';
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
          <Container width="full">
            <Grid>
              <GridItem span={12}>
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
              </GridItem>
            </Grid>

            <Grid>
              {group.items.map((item: NavThumbnailItem) => (
                <GridItem
                  span={12}
                  spanMd={4}
                  key={item.id}
                >
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
                </GridItem>
              ))}
            </Grid>
          </Container>
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

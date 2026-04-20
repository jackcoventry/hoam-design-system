import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import { CategoryGroup } from '@/components/Navigation/MainNavigation/CategoryGroup';
import { Panel } from '@/components/Navigation/MainNavigation/Panel';
import { PromoBlock } from '@/components/Navigation/MainNavigation/PromoBlock/PromoBlock';
import { ThirdLevelItems } from '@/components/Navigation/MainNavigation/ThirdLevelItems';
import { TopNavigation } from '@/components/Navigation/MainNavigation/TopNavigation';
import { TopNavigationItem } from '@/components/Navigation/MainNavigation/TopNavigationItem';
import type {
  DesktopNavigationItemsProps,
  NavGroupItem,
  NavPanelItem,
} from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Navigation/Navigation.module.css';

function isNavGroupItem(item: NavPanelItem): item is NavGroupItem {
  return 'layout' in item && 'items' in item;
}

export function DesktopNavigationItems({
  items,
  openIndex,
  openGroupId,
  setOpenGroupId,
  handleTopNavigationOpen,
  clearLeave,
  onOpenFirstCategory,
  onResetNavigation,
}: Readonly<DesktopNavigationItemsProps>) {
  const t = useMessages('navigation');
  return (
    <TopNavigation>
      {items.map((item, index) => {
        const hasPanel = Boolean(item?.items?.length);
        const isOpen = openIndex === index;

        return (
          <TopNavigationItem
            key={item.id}
            item={item}
            isOpen={isOpen}
            hasPanel={hasPanel}
            onHoverOpen={() => handleTopNavigationOpen(index)}
            onHoverClose={onResetNavigation}
            onFocusOpen={() => {
              handleTopNavigationOpen(index);
              onOpenFirstCategory(index);
            }}
          >
            {hasPanel ? (
              <Panel
                id={panelId(item.id)}
                labelledBy={topTriggerId(item.id)}
                hidden={!isOpen}
                onEnter={() => clearLeave()}
                left={
                  <div className={styles.panelTopLevel}>
                    {item?.items?.map((sub) => {
                      if (!isNavGroupItem(sub)) {
                        return (
                          <div
                            key={sub.id}
                            className={styles.group}
                          >
                            <a
                              href={sub.href}
                              className={styles.groupTopLink}
                              data-sub-trigger
                            >
                              {sub.label}
                            </a>
                          </div>
                        );
                      }

                      const open = openGroupId === sub.id;

                      return (
                        <CategoryGroup
                          key={sub.id}
                          subitem={sub}
                          open={open}
                          onHoverOpen={() => setOpenGroupId(sub.id)}
                          onFocusOpen={() => setOpenGroupId(sub.id)}
                        >
                          {sub.items.length > 0 ? (
                            <ThirdLevelItems
                              group={sub}
                              open={open}
                            />
                          ) : null}
                        </CategoryGroup>
                      );
                    })}
                  </div>
                }
                right={
                  item.thumbnail ? (
                    <aside
                      className={styles.promoWrapper}
                      aria-label={t.exploreLabel(item.label)}
                    >
                      <PromoBlock
                        title={item.label}
                        subtitle={t.explore}
                        image={item.thumbnail}
                        href={`/explore/${item.id}`}
                      />
                    </aside>
                  ) : null
                }
              />
            ) : null}
          </TopNavigationItem>
        );
      })}
    </TopNavigation>
  );
}

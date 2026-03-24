import {
  CategoryGroup,
  Panel,
  PromoBlock,
  ThirdLevelItems,
  TopNavigation,
  TopNavigationItem,
} from '@/components/Navigation';
import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import type { NavGroupItem, NavPanelItem, NavTopLevelItem } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

export type DesktopNavigationItemsProps = {
  items: NavTopLevelItem[];
  openIndex: number | null;
  openGroupId: string | null;
  setOpenGroupId: (id: string | null) => void;
  handleTopNavigationOpen: (index: number) => void;
  clearLeave: () => void;
  onOpenFirstCategory: (topIndex: number) => void;
  onResetNavigation: () => void;
};

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
                      aria-label={`${item.label} highlights`}
                    >
                      <PromoBlock
                        title={item.label}
                        subtitle="Explore"
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

import CategoryGroup from '@/components/Navigation/MainNavigation/CategoryGroup';
import Panel from '@/components/Navigation/MainNavigation/Panel';
import { PromoBlock } from '@/components/Navigation/MainNavigation/PromoBlock';
import ThirdLevelList from '@/components/Navigation/MainNavigation/ThirdLevelItems';
import TopNav from '@/components/Navigation/MainNavigation/TopNavigation';
import TopNavItem from '@/components/Navigation/MainNavigation/TopNavigationItem';
import type { NavTopLevelItem } from '@/components/Navigation/types/Navigation.types';
import { panelId, topTriggerId } from '@/components/Navigation/utils/helpers';

type DesktopNavigationItemsProps = {
  items: NavTopLevelItem[];
  openIndex: number | null;
  openGroupId: string | null;
  setOpenGroupId: (id: string | null) => void;
  handleTopNavigationOpen: (index: number) => void;
  clearLeave: () => void;
  onOpenFirstCategory: (topIndex: number) => void;
  onResetNavigation: () => void;
};

export default function DesktopNavigationItems({
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
    <TopNav>
      {items.map((item, index) => {
        const hasPanel = Boolean(item.items?.length);
        const isOpen = openIndex === index;

        return (
          <TopNavItem
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
                  <div className="hoam-navigation__panel-top-level">
                    {item.items?.map((sub) => {
                      const open = openGroupId === sub.id;

                      return (
                        <CategoryGroup
                          key={sub.id}
                          subitem={sub}
                          open={open}
                          onHoverOpen={() => setOpenGroupId(sub.id)}
                          onFocusOpen={() => setOpenGroupId(sub.id)}
                        >
                          {sub.items?.length ? (
                            <ThirdLevelList
                              parent={sub}
                              items={sub.items}
                              open={open}
                              layout={sub.layout}
                            />
                          ) : null}
                        </CategoryGroup>
                      );
                    })}
                  </div>
                }
                right={
                  <aside
                    className="hoam-navigation__panel-promo"
                    aria-label={`${item.label} highlights`}
                  >
                    <PromoBlock
                      title={item.label}
                      subtitle="Explore"
                      image={item.thumbnail}
                      href={`/explore/${item.id}`}
                    />
                  </aside>
                }
              />
            ) : null}
          </TopNavItem>
        );
      })}
    </TopNav>
  );
}

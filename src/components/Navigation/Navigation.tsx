import { useKeyboardNav } from '@/components/Navigation/hooks/useKeyboardNav';
import { useMegaNavState } from '@/components/Navigation/hooks/useNavState';
import CategoryGroup from '@/components/Navigation/MainNavigation/CategoryGroup';
import Panel from '@/components/Navigation/MainNavigation/Panel';
import ThirdLevelList from '@/components/Navigation/MainNavigation/ThirdLevelItems';
import TopNav from '@/components/Navigation/MainNavigation/TopNavigation';
import TopNavItem from '@/components/Navigation/MainNavigation/TopNavigationItem';
import MobileNavigation from '@/components/Navigation/MobileNavigation/MobileNavigation';
import { panelId, topTriggerId } from '@/components/Navigation/Navigation.types';
import { querySubItemVisibility } from '@/components/Navigation/utils/helpers';
import React, { useMemo, useRef } from 'react';
import './Navigation.css';
import type { NavigationProps } from './Navigation.types';

export default function Navigation({ items, userItems }: Readonly<NavigationProps>) {
  const rootRef = useRef<HTMLElement>(null);
  const {
    openIndex,
    setOpenIndex,
    openGroupId,
    setOpenGroupId,
    setKeyboarding,
    handleTopNavigationOpen,
    handleAllNavigationClose,
    clearLeave,
  } = useMegaNavState();

  const isRTL = typeof document !== 'undefined' && document.dir === 'rtl';
  const mapArrow = (key: string) =>
    isRTL && (key === 'ArrowLeft' || key === 'ArrowRight')
      ? key === 'ArrowRight' || 'ArrowLeft'
      : key;

  const subSelectors = {
    subTriggersOnly: (panelRoot: Element) =>
      querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger]'),
    subInteractive: (panelRoot: Element) =>
      querySubItemVisibility<HTMLElement>(panelRoot, '[data-sub-trigger], [data-sub-link]'),
    thirdList: (container: Element, domId: string) =>
      querySubItemVisibility<HTMLElement>(container, `#${domId}-panel [data-sub-link]`),
  };

  const onKeyDown = useKeyboardNav(
    rootRef,
    items,
    setOpenIndex,
    setOpenGroupId,
    mapArrow,
    subSelectors
  );

  const mobileNavigation = useMemo(() => [...items, ...userItems], [items, userItems]);

  const openFirstCategoryVisually = (topIndex: number) => {
    const firstId = items[topIndex]?.items?.[0]?.id;
    setOpenGroupId(firstId ?? null);
  };

  return (
    <>
      <MobileNavigation items={mobileNavigation} />

      <header
        ref={rootRef as any}
        onPointerLeave={() => handleAllNavigationClose()}
        onPointerEnter={() => clearLeave()}
        onKeyDown={(e) => {
          setKeyboarding();
          onKeyDown(e);
        }}
        role="none"
      >
        <div className="hoam-navigation">
          <div className="container">
            <div className="grid">
              <div className="span-12">
                <div
                  className="hoam-navigation__inner"
                  data-open={openIndex !== null || undefined}
                >
                  <TopNav>
                    {items.map((item, index) => {
                      const hasPanel = !!item.items?.length;
                      const isOpen = openIndex === index;

                      return (
                        <TopNavItem
                          key={item.id}
                          item={item}
                          index={index}
                          isOpen={isOpen}
                          hasPanel={hasPanel}
                          onHoverOpen={() => handleTopNavigationOpen(index)}
                          onFocusOpen={() => {
                            handleTopNavigationOpen(index);
                            openFirstCategoryVisually(index);
                          }}
                          onClickToggle={() => {
                            const next = isOpen ? null : index;
                            setOpenIndex(next);
                            if (next === null) {
                              setOpenGroupId(null);
                            } else {
                              openFirstCategoryVisually(next);
                            }
                          }}
                        >
                          {hasPanel && (
                            <Panel
                              id={panelId(item.id)}
                              labelledBy={topTriggerId(item.id)}
                              hidden={!isOpen}
                              onEnter={() => clearLeave()}
                              left={
                                <div className="hoam-navigation__panel-top-level">
                                  <a
                                    href={item.href}
                                    data-sub-link
                                  >
                                    View all {item.label}
                                  </a>

                                  {item?.items?.map((sub) => {
                                    const open = openGroupId === sub.id;
                                    return (
                                      <CategoryGroup
                                        key={sub.id}
                                        subitem={sub}
                                        open={open}
                                        onHoverOpen={() => setOpenGroupId(sub.id)}
                                        onFocusOpen={() => setOpenGroupId(sub.id)}
                                        onClickToggle={() => setOpenGroupId(open ? null : sub.id)}
                                      >
                                        {sub.items?.length ? (
                                          <ThirdLevelList
                                            parentId={sub.id}
                                            items={sub.items}
                                            open={open}
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
                                  Some other promo stuff
                                </aside>
                              }
                            />
                          )}
                        </TopNavItem>
                      );
                    })}
                  </TopNav>

                  <a
                    href="/"
                    className="hoam-navigation__logo"
                  >
                    <img
                      src="/logo.svg"
                      alt="Hoam Logo"
                    />
                  </a>

                  {userItems?.length > 0 ? (
                    <nav aria-label="User navigation">
                      <ul
                        className="hoam-navigation__list"
                        data-alignment="right"
                      >
                        {userItems.map((u) => (
                          <li
                            key={u.id}
                            className="hoam-navigation__item"
                          >
                            <a
                              href={u.href}
                              className="hoam-navigation__link"
                              title={u.label}
                            >
                              <svg
                                className="icon"
                                width="1.25em"
                                height="1.25em"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <use xlinkHref={`/icons/icons.svg#${u.icon}`} />
                              </svg>
                              <span className="sr-only">{u.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

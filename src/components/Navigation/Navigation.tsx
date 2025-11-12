import MobileNavigation from '@/components/Navigation/MobileNavigation/MobileNavigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Navigation.css';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  items?: NavItem[];
};

export type NavigationProps = {
  items: NavItem[];
  userItems: NavItem[];
};

function Navigation({ items, userItems }: Readonly<NavigationProps>) {
  const rootRef = useRef<HTMLElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const hoverTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const HOVER_DELAY = 80;
  const LEAVE_DELAY = 150;

  // Guard to prevent issue relating to keyboard and hover interactivty clashing
  const [isKeyboarding, setIsKeyboarding] = useState(false);
  const kbQuietTimer = useRef<number | null>(null);

  const quietKeyboarding = () => {
    setIsKeyboarding(true);
    if (kbQuietTimer.current) clearTimeout(kbQuietTimer.current);
    kbQuietTimer.current = setTimeout(() => setIsKeyboarding(false), 400) as unknown as number;
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const handleOpenTopNavigation = (index: number) => {
    clearLeaveTimer();
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      setOpenIndex(index);
      setOpenGroupId(null);
    }, HOVER_DELAY) as unknown as number;
  };

  const handleCloseAllNavigation = () => {
    if (isKeyboarding) return;
    clearHoverTimer();
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => {
      setOpenGroupId(null);
      setOpenIndex(null);
    }, LEAVE_DELAY) as unknown as number;
  };

  useEffect(() => {
    if (openIndex === null) setOpenGroupId(null);
  }, [openIndex]);

  // Close whole navigation with escape key, return focus to trigger element
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openGroupId) {
        setOpenGroupId(null);
        return;
      }
      if (openIndex !== null) {
        setOpenIndex(null);
        const trigger = rootRef.current?.querySelector<HTMLElement>(
          '[data-top-trigger][aria-expanded="true"]'
        );
        trigger?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openIndex, openGroupId]);

  // Close when focus leaves header
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpenGroupId(null);
        setOpenIndex(null);
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  // Left/Right mapping with RTL support
  const mapArrow = (key: string) => {
    const isRTL = typeof document !== 'undefined' && document.dir === 'rtl';
    if (!isRTL) return key;
    if (key === 'ArrowLeft') return 'ArrowRight';
    if (key === 'ArrowRight') return 'ArrowLeft';
    return key;
  };

  const isElementVisible = (el: Element) => {
    const e = el as HTMLElement;
    if (!e) return false;
    if (e.closest('[hidden]')) return false;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (e.tabIndex === -1) return false;
    return e.offsetWidth > 0 && e.offsetHeight > 0;
  };

  const querySubItemVisibility = <T extends HTMLElement>(root: Element | Document, sel: string) =>
    Array.from(root.querySelectorAll<T>(sel)).filter(isElementVisible);

  const focusNextElement = (el?: HTMLElement | null) => {
    if (el) requestAnimationFrame(() => el.focus());
  };

  const moveFocusInElementList = (list: HTMLElement[], current: HTMLElement, delta: number) => {
    if (!list.length) return;
    const idx = Math.max(0, list.indexOf(current));
    const wrapIndex = (i: number, len: number) => (i + len) % len;
    const next = list[wrapIndex(idx + delta, list.length)];
    focusNextElement(next);
  };

  const openFirstCategoryVisually = (topIndex: number) => {
    const firstId = items[topIndex]?.items?.[0]?.id;
    setOpenGroupId(firstId ?? null);
  };

  const onNavKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const logicalKey = mapArrow(e.key);
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(logicalKey))
      return;

    e.preventDefault();
    e.stopPropagation();
    quietKeyboarding();

    const container = rootRef.current;
    const target = e.target as HTMLElement;

    const isTop = target.matches('[data-top-trigger]');
    const isSubTrigger = target.matches('[data-sub-trigger]');
    const isThird = target.matches('[data-sub-link]');

    const topTriggers = querySubItemVisibility<HTMLElement>(container, '[data-top-trigger]');

    const panelRootFor = (topIdx: number) =>
      container.querySelector<HTMLElement>(`#panel-${items[topIdx].id}`) ?? container;

    const subTriggers = (topIdx: number) =>
      querySubItemVisibility<HTMLElement>(panelRootFor(topIdx), `[data-sub-trigger]`);

    const subInteractive = (topIdx: number) =>
      querySubItemVisibility<HTMLElement>(
        panelRootFor(topIdx),
        `[data-sub-trigger], [data-sub-link]`
      );

    const thirdList = (groupBtnId: string) =>
      querySubItemVisibility<HTMLElement>(container, `#${groupBtnId}-panel [data-sub-link]`);

    // Top level keyboard navigation
    if (isTop) {
      const topIndex = topTriggers.indexOf(target);
      switch (logicalKey) {
        case 'ArrowRight':
          moveFocusInElementList(topTriggers, target, +1);
          return;
        case 'ArrowLeft':
          moveFocusInElementList(topTriggers, target, -1);
          return;
        case 'Home':
          focusNextElement(topTriggers[0]);
          return;
        case 'End':
          focusNextElement(topTriggers[topTriggers.length - 1]);
          return;
        case 'ArrowDown': {
          const hasPanel = !!items[topIndex]?.items?.length;
          if (!hasPanel) return;
          setOpenIndex(topIndex);
          openFirstCategoryVisually(topIndex);
          requestAnimationFrame(() => {
            const firstCategory = subTriggers(topIndex)[0] ?? subInteractive(topIndex)[0];
            if (firstCategory) firstCategory.focus();
          });
          return;
        }
      }
    }

    // Second level keyboard navigation
    if (isSubTrigger) {
      const panelEl = target.closest('[id^="panel-"]');
      if (!panelEl) return;
      const topIdx = items.findIndex((t) => `panel-${t.id}` === panelEl.id);
      const cats = subTriggers(topIdx);
      switch (logicalKey) {
        case 'ArrowDown':
          moveFocusInElementList(cats, target, +1);
          return;
        case 'ArrowUp':
          moveFocusInElementList(cats, target, -1);
          return;
        case 'Home':
          focusNextElement(cats[0]);
          return;
        case 'End':
          focusNextElement(cats[cats.length - 1]);
          return;
        case 'ArrowLeft': {
          const back = querySubItemVisibility<HTMLElement>(container, '[data-top-trigger]')[topIdx];
          if (back) focusNextElement(back);
          return;
        }
        case 'ArrowRight': {
          const groupBtnId = target.id;
          const rawId = groupBtnId.replace(/^group-/, '');
          setOpenGroupId(rawId);
          requestAnimationFrame(() => {
            const firstThird = thirdList(groupBtnId)[0];
            if (firstThird) firstThird.focus();
          });
          return;
        }
      }
    }

    // Third and final level keyboard navigation
    if (isThird) {
      const listContainer = target.closest('[id$="-panel"]');
      const groupPanelId = listContainer?.id;
      const groupBtnId = groupPanelId?.replace(/-panel$/, '');
      const siblings = thirdList(groupBtnId);
      switch (logicalKey) {
        case 'ArrowDown':
          moveFocusInElementList(siblings, target, +1);
          return;
        case 'ArrowUp':
          moveFocusInElementList(siblings, target, -1);
          return;
        case 'Home':
          focusNextElement(siblings[0]);
          return;
        case 'End':
          focusNextElement(siblings[siblings.length - 1]);
          return;
        case 'ArrowLeft':
          setOpenGroupId(null);
          focusNextElement(document.getElementById(groupBtnId));
          return;
      }
    }
  };

  const mobileNavigation = useMemo(() => [...items, ...userItems], [items, userItems]);

  return (
    <>
      <MobileNavigation items={mobileNavigation} />

      <header
        ref={rootRef}
        onPointerLeave={handleCloseAllNavigation}
        onPointerEnter={() => clearLeaveTimer()}
        onKeyDown={onNavKeyDown}
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
                  <nav aria-label="Main navigation">
                    <ul className="hoam-navigation__list">
                      {items.map((item, index) => {
                        const hasPanel = !!item.items?.length;
                        const isOpen = openIndex === index;
                        const triggerId = `trigger-${item.id}`;
                        const panelId = `panel-${item.id}`;

                        return (
                          <li
                            key={item.id}
                            className="hoam-navigation__item"
                            onPointerEnter={() => hasPanel && handleOpenTopNavigation(index)}
                          >
                            {hasPanel ? (
                              <button
                                id={triggerId}
                                data-top-trigger
                                className="hoam-navigation__link"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onFocus={() => {
                                  handleOpenTopNavigation(index);
                                  openFirstCategoryVisually(index);
                                }}
                                onClick={() => {
                                  const nextOpen = isOpen ? null : index;
                                  setOpenIndex(nextOpen);
                                  if (nextOpen === null) {
                                    setOpenGroupId(null);
                                  } else {
                                    openFirstCategoryVisually(nextOpen);
                                  }
                                }}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <a
                                id={triggerId}
                                data-top-trigger
                                className="hoam-navigation__link"
                                href={item.href}
                                onFocus={() => {
                                  setOpenIndex(null);
                                  setOpenGroupId(null);
                                }}
                              >
                                {item.label}
                              </a>
                            )}

                            {hasPanel ? (
                              <div
                                id={panelId}
                                className="hoam-navigation__panel"
                                aria-labelledby={triggerId}
                                hidden={!isOpen}
                                onPointerEnter={() => clearLeaveTimer()}
                              >
                                <div className="container">
                                  <div className="grid">
                                    <div className="span-12 lg:span-8">
                                      <div className="hoam-navigation__panel-top-level">
                                        {item?.items?.map((subitem) => {
                                          const hasThird = !!subitem.items?.length;
                                          const groupOpen = openGroupId === subitem.id;
                                          const groupBtnId = `group-${subitem.id}`;
                                          const groupPanelId = `${groupBtnId}-panel`;

                                          return (
                                            <div
                                              key={subitem.id}
                                              className="hoam-navigation__group"
                                              onPointerEnter={() => setOpenGroupId(subitem.id)}
                                            >
                                              <button
                                                id={groupBtnId}
                                                data-sub-trigger
                                                aria-expanded={groupOpen}
                                                aria-controls={groupPanelId}
                                                onFocus={() => setOpenGroupId(subitem.id)}
                                                onClick={() =>
                                                  setOpenGroupId(groupOpen ? null : subitem.id)
                                                }
                                              >
                                                {subitem.label}
                                              </button>

                                              {hasThird && (
                                                <div
                                                  id={groupPanelId}
                                                  className="hoam-navigation__panel-sub-level"
                                                  aria-labelledby={groupBtnId}
                                                  hidden={!groupOpen}
                                                >
                                                  {subitem.href && (
                                                    <a
                                                      href={subitem.href}
                                                      data-sub-link
                                                    >
                                                      View all {subitem.label}
                                                    </a>
                                                  )}

                                                  {subitem?.items?.map((subChild) => (
                                                    <a
                                                      key={subChild.id}
                                                      href={subChild.href}
                                                      data-sub-link
                                                      tabIndex={groupOpen ? 0 : -1}
                                                    >
                                                      {subChild.label}
                                                    </a>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="span-12 lg:span-4">
                                      <aside
                                        className="hoam-navigation__panel-promo"
                                        aria-label={`${item.label} highlights`}
                                      >
                                        Some other promo stuff
                                      </aside>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <a
                    href="/"
                    className="hoam-navigation__logo"
                  >
                    <img
                      src="/logo.svg"
                      alt="Hoam Logo"
                    />
                  </a>

                  {userItems.length > 0 ? (
                    <nav aria-label="User navigation">
                      <ul
                        className="hoam-navigation__list"
                        data-alignment="right"
                      >
                        {userItems.map((item) => (
                          <li
                            key={item.id}
                            className="hoam-navigation__item"
                          >
                            <a
                              href={item.href}
                              className="hoam-navigation__link"
                              title={item.label}
                            >
                              <svg
                                className="icon"
                                width="1.25em"
                                height="1.25em"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <use xlinkHref={`/icons/icons.svg#${item.icon}`} />
                              </svg>
                              <span className="sr-only">{item.label}</span>
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

export default Navigation;

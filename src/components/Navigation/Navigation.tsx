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
  const [openGroupId, setOpenGroupId] = useState<string | null>(null); // second-level group

  const HOVER_DELAY = 80; // ms
  const LEAVE_DELAY = 150; // ms
  const hoverTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const mobileNavigation = useMemo(() => [...items, ...userItems], [items, userItems]);

  // Close on Escape anywhere within the nav
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenIndex(null);
        rootRef?.current
          ?.querySelector<HTMLElement>('[data-top-trigger][aria-expanded="true"]')
          ?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Close when focus leaves the nav entirely
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, []);

  // Reset the active group when panel changes/closes:
  useEffect(() => {
    if (openIndex === null) setOpenGroupId(null);
  }, [openIndex]);

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

  const handleOpen = (index: number) => {
    clearLeaveTimer();
    clearHoverTimer();
    hoverTimer.current = setTimeout(() => {
      setOpenIndex(index);
    }, HOVER_DELAY) as unknown as number;
  };

  const requestClose = () => {
    clearHoverTimer();
    clearLeaveTimer();
    leaveTimer.current = setTimeout(() => {
      setOpenIndex(null);
    }, LEAVE_DELAY) as unknown as number;
  };

  const onTopKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    hasPanel: boolean
  ) => {
    const total = items.length;
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const next = (index + 1) % total;
        rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-top-trigger]')[next]?.focus();
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const prev = (index - 1 + total) % total;
        rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-top-trigger]')[prev]?.focus();
        break;
      }
      case 'ArrowDown': {
        if (hasPanel) {
          e.preventDefault();
          setOpenIndex(index);
          // move to first item in panel
          const first = rootRef.current?.querySelector<HTMLElement>(
            `#panel-${items[index].id} [data-sub-link], #panel-${items[index].id} a, #panel-${items[index].id} button`
          );
          first?.focus();
        }
        break;
      }
      case 'Enter':
      case ' ': {
        if (hasPanel) {
          e.preventDefault();
          setOpenIndex(openIndex === index ? null : index);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <MobileNavigation items={mobileNavigation} />
      <header ref={rootRef}>
        <div
          className="hoam-navigation"
          onPointerLeave={requestClose}
          onPointerEnter={() => clearLeaveTimer()}
        >
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
                            onPointerEnter={() => hasPanel && handleOpen(index)}
                          >
                            {/* Top level trigger */}
                            {hasPanel ? (
                              <button
                                id={triggerId}
                                data-top-trigger
                                className="hoam-navigation__link"
                                aria-haspopup="dialog"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onFocus={() => handleOpen(index)}
                                onKeyDown={(e) => onTopKeyDown(e, index, hasPanel)}
                              >
                                {item.label}
                              </button>
                            ) : (
                              <a
                                id={triggerId}
                                className="hoam-navigation__link"
                                href={item.href}
                                onFocus={() => setOpenIndex(null)}
                              >
                                {item.label}
                              </a>
                            )}

                            {/* Panel */}
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
                                        {/* “View all” preserves the original href */}
                                        <a
                                          href={item.href}
                                          className="hoam-navigation__sublink hoam-navigation__sublink--view-all"
                                          data-sub-link
                                        >
                                          View all {item.label}
                                        </a>

                                        {item.items!.map((subitem, i2) => {
                                          const groupOpen = openGroupId === subitem.id;
                                          const groupId = `group-${subitem.id}`;
                                          const groupPanelId = `group-panel-${subitem.id}`;

                                          return (
                                            <div
                                              key={subitem.id}
                                              className="hoam-navigation__group"
                                              onPointerEnter={() => setOpenGroupId(subitem.id)}
                                            >
                                              {/* The 2nd-level "parent" as a disclosure button (keeps your href via a sibling "View all") */}
                                              <button
                                                id={groupId}
                                                className="hoam-navigation__sublink"
                                                aria-expanded={groupOpen}
                                                aria-controls={groupPanelId}
                                                onFocus={() => setOpenGroupId(subitem.id)}
                                                onKeyDown={(e) => {
                                                  switch (e.key) {
                                                    case 'ArrowRight': {
                                                      // open this group & focus first 3rd-level link
                                                      if (subitem.items?.length) {
                                                        e.preventDefault();
                                                        setOpenGroupId(subitem.id);
                                                        queueMicrotask(() => {
                                                          const first =
                                                            document.querySelector<HTMLElement>(
                                                              `#${groupPanelId} a, #${groupPanelId} [data-sub-link]`
                                                            );
                                                          first?.focus();
                                                        });
                                                      }
                                                      break;
                                                    }
                                                    case 'ArrowLeft': {
                                                      // close group: send focus back to top trigger
                                                      if (subitem.items?.length) {
                                                        e.preventDefault();
                                                        setOpenGroupId(null);
                                                        // focus the second-level button itself
                                                        (e.currentTarget as HTMLElement).focus();
                                                      }
                                                      break;
                                                    }
                                                    case 'Escape': {
                                                      e.preventDefault();
                                                      setOpenGroupId(null);
                                                      break;
                                                    }
                                                  }
                                                }}
                                              >
                                                {subitem.label}
                                              </button>

                                              {subitem.items?.length ? (
                                                <div
                                                  id={groupPanelId}
                                                  className="hoam-navigation__panel-sub-level"
                                                  role="group"
                                                  aria-labelledby={groupId}
                                                  hidden={!groupOpen}
                                                >
                                                  {subitem.href && (
                                                    <a
                                                      href={subitem.href}
                                                      className="hoam-navigation__sublink hoam-navigation__sublink--view-all"
                                                      data-sub-link
                                                    >
                                                      View all {subitem.label}
                                                    </a>
                                                  )}

                                                  {subitem.items.map((subsubitem) => (
                                                    <a
                                                      key={subsubitem.id}
                                                      href={subsubitem.href}
                                                      className="hoam-navigation__subsublink"
                                                      // if hidden, remove from tab order
                                                      tabIndex={groupOpen ? 0 : -1}
                                                      data-sub-link
                                                    >
                                                      {subsubitem.label}
                                                    </a>
                                                  ))}
                                                </div>
                                              ) : null}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="span-12 lg:span-4">
                                      <div className="hoam-navigation__panel-promo">
                                        Some other promo stuff
                                      </div>
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

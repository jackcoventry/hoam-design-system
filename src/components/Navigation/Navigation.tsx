import { useFocusTrap } from '@/utils/useFocusTrap';
import React, { useRef } from 'react';
import MobileItem from './MobileItem/MobileItem';
import './Navigation.css';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  panel?: React.ReactNode;
};

export type NavigationProps = {
  items: NavItem[];
};

function Navigation({ items }: Readonly<NavigationProps>) {
  const navigationRef = useRef<HTMLButtonElement>(null);
  const idPrefix = 'hoam-nav';
  const panelId = (id: string) => `${idPrefix}-panel-${id}`;
  const buttonId = (id: string) => `${idPrefix}-button-${id}`;

  const [mobileNavigationVisible, setMobileNavigationVisibility] = React.useState(false);

  useFocusTrap({
    containerRef: navigationRef,
    active: mobileNavigationVisible,
    onEscape: () => setMobileNavigationVisibility(false),
  });

  return (
    <header
      className="hoam-navigation"
      ref={navigationRef}
    >
      <div className="hoam_navigation__mobile">
        <div className="container-fluid">
          <div className="grid">
            <div className="span-12">
              <div className="hoam-navigation__inner">
                <a
                  href="/"
                  className="hoam-navigation__logo"
                >
                  <img
                    src="/logo.svg"
                    alt="Hoam Logo"
                  />
                </a>
                <button
                  className="hoam-navigation__toggle"
                  aria-label={mobileNavigationVisible ? 'Close menu' : 'Open menu'}
                  onClick={() => setMobileNavigationVisibility(!mobileNavigationVisible)}
                >
                  <svg
                    className="icon"
                    width="1.25em"
                    height="1.25em"
                    fill="currentColor"
                  >
                    <use xlinkHref={`/icons/icons.svg#three-dots-vertical`} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-state={mobileNavigationVisible ? 'open' : 'closed'}
        className="hoam-navigation__mobile-menu"
      >
        <nav aria-label="Main navigation">
          <ul className="hoam-navigation__list">
            {items.map((item) => (
              <MobileItem
                key={item.id}
                item={item}
              />
            ))}
            <li className="hoam-navigation__item">
              <button className="hoam-navigation__link">My Account</button>
            </li>
            <li className="hoam-navigation__item">
              <button className="hoam-navigation__link">My basket</button>
            </li>
            <li className="hoam-navigation__item">
              <button className="hoam-navigation__link">Search</button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hoam-navigation__desktop">
        <div className="container">
          <div className="grid">
            <div className="span-12">
              <div className="hoam-navigation__inner">
                <nav aria-label="Main navigation">
                  <ul className="hoam-navigation__list">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="hoam-navigation__item"
                      >
                        <a
                          href={item.href}
                          id={buttonId(item.id)}
                          aria-controls={item.panel ? panelId(item.id) : undefined}
                          aria-expanded={item.panel ? 'false' : undefined}
                          className="hoam-navigation__link"
                        >
                          {item.label}
                        </a>
                        {item.panel && (
                          <div
                            id={panelId(item.id)}
                            aria-labelledby={buttonId(item.id)}
                            className="hoam-navigation__panel"
                          >
                            {item.panel}
                          </div>
                        )}
                      </li>
                    ))}
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
                <nav aria-label="User navigation">
                  <ul
                    className="hoam-navigation__list"
                    data-alignment="right"
                  >
                    <li className="hoam-navigation__item">
                      <a
                        href="/account"
                        className="hoam-navigation__link"
                        title="My Account"
                      >
                        <svg
                          className="icon"
                          width="1.25em"
                          height="1.25em"
                          fill="currentColor"
                        >
                          <use xlinkHref={`/icons/icons.svg#person-circle`} />
                        </svg>
                      </a>
                    </li>
                    <li className="hoam-navigation__item">
                      <a
                        href="/basket"
                        className="hoam-navigation__link"
                        title="My basket"
                      >
                        <svg
                          className="icon"
                          width="1.25em"
                          height="1.25em"
                          fill="currentColor"
                        >
                          <use xlinkHref={`/icons/icons.svg#bag`} />
                        </svg>
                      </a>
                    </li>
                    <li className="hoam-navigation__item">
                      <a
                        href="/search"
                        className="hoam-navigation__link"
                        title="Search"
                      >
                        <svg
                          className="icon"
                          width="1.25em"
                          height="1.25em"
                          fill="currentColor"
                        >
                          <use xlinkHref={`/icons/icons.svg#search`} />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;

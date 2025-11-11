import MobileNavigation from '@/components/Navigation/MobileNavigation/MobileNavigation';
import React, { useRef } from 'react';
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

  const userItems = [
    {
      id: 'account',
      label: 'My Account',
      href: '/account',
      icon: 'person-circle',
      title: 'My Account',
    },
    {
      id: 'basket',
      label: 'My Basket',
      href: '/basket',
      icon: 'bag',
      title: 'My basket',
    },
    {
      id: 'search',
      label: 'Search',
      href: '/search',
      icon: 'search',
      title: 'Search',
    },
  ];

  const mobileNavigation = [...items, ...userItems];

  return (
    <>
      <MobileNavigation items={mobileNavigation} />
      <header ref={navigationRef}>
        <div className="hoam-navigation">
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

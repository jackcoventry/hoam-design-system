import React from 'react';
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
  const idPrefix = 'hoam-nav';
  const panelId = (id: string) => `${idPrefix}-panel-${id}`;
  const buttonId = (id: string) => `${idPrefix}-button-${id}`;

  return (
    <header className="hoam-navigation">
      <div
        className="container"
        data-visible-on="mobile"
      >
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
                aria-label="Toggle menu"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        data-visible-on="mobile"
        data-state="closed"
        className="hoam-navigation__mobile-menu"
      >
        <nav aria-label="Main navigation">
          <ul className="hoam-navigation__list">
            {items.map((item) => (
              <li
                key={item.id}
                className="hoam-navigation__item"
              >
                <button
                  id={buttonId(item.id)}
                  aria-controls={item.panel ? panelId(item.id) : undefined}
                  aria-expanded={item.panel ? 'false' : undefined}
                  className="hoam-navigation__link"
                >
                  {item.label}
                </button>
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
        <nav aria-label="User navigation">
          <ul className="hoam-navigation__list">
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
      <div
        className="container"
        data-visible-on="desktop"
      >
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
    </header>
  );
}

export default Navigation;

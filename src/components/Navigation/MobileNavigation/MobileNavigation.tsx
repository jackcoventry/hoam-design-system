import MobileItem from '@/components/Navigation/MobileItem/MobileItem';
import useFocusTrap from '@/utils/useFocusTrap';
import React from 'react';
import './MobileNavigation.css';

function MobileNavigation({ items }) {
  const navigationRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  useFocusTrap({
    containerRef: navigationRef,
    active: visible,
    onEscape: () => setVisible(false),
  });

  return (
    <header
      className="hoam-mobile-navigation"
      ref={navigationRef}
    >
      <div className="hoam-mobile-navigation__wrapper">
        <div className="container-fluid">
          <div className="grid">
            <div className="span-12">
              <div className="hoam-mobile-navigation__inner">
                <a
                  href="/"
                  className="hoam-mobile-navigation__logo"
                >
                  <img
                    src="/logo.png"
                    alt="Hoam Logo"
                  />
                </a>
                <button
                  className="hoam-mobile-navigation__toggle"
                  aria-label={visible ? 'Close menu' : 'Open menu'}
                  onClick={() => setVisible(!visible)}
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
        data-state={visible ? 'open' : 'closed'}
        className="hoam-mobile-navigation__mobile-menu"
      >
        <nav aria-label="Main navigation">
          <ul className="hoam-mobile-navigation__list">
            {items?.map((item) => (
              <MobileItem
                key={item.id}
                item={item}
              />
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default MobileNavigation;

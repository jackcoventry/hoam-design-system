import MobileNavigationItem from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
import type { NavTreeItem } from '@/components/Navigation/types/Navigation.types';
import useFocusTrap from '@/hooks/useFocusTrap';
import { useId, useRef, useState } from 'react';
import './MobileNavigation.css';

type MobileNavigationProps = {
  items: NavTreeItem[];
};

export function MobileNavigation({ items }: Readonly<MobileNavigationProps>) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useFocusTrap({
    containerRef: navigationRef,
    active: isOpen,
    onEscape: () => setIsOpen(false),
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
                  type="button"
                  className="hoam-mobile-navigation__toggle"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <svg
                    className="icon"
                    width="1.25em"
                    height="1.25em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <use xlinkHref="/icons/icons.svg#three-dots-vertical" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id={menuId}
        data-state={isOpen ? 'open' : 'closed'}
        className="hoam-mobile-navigation__mobile-menu"
      >
        <nav aria-label="Main navigation">
          <ul className="hoam-mobile-navigation__list">
            {items.map((item) => (
              <MobileNavigationItem
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

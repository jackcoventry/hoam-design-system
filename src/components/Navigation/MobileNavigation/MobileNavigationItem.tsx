import styles from '@/components/Navigation/MobileNavigation/MobileNavigation.module.css';
import type { NavTreeItem } from '@/components/Navigation/types';
import { useMemo, useState } from 'react';

type MobileNavigationItemProps = {
  item: NavTreeItem;
};

function hasChildren(item: NavTreeItem): item is NavTreeItem & { items: NavTreeItem[] } {
  return 'items' in item && Array.isArray(item?.items) && item?.items?.length > 0;
}

function hasHref(item: NavTreeItem): item is NavTreeItem & { href: string } {
  return 'href' in item && typeof item.href === 'string' && item.href.length > 0;
}

export function MobileNavigationItem({ item }: Readonly<MobileNavigationItemProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const ids = useMemo(() => {
    const prefix = 'hoam-mobile-navigation';
    return {
      button: `${prefix}-button-${item.id}`,
      panel: `${prefix}-panel-${item.id}`,
    };
  }, [item.id]);

  const itemHasChildren = hasChildren(item);
  const itemHasHref = hasHref(item);

  return (
    <li className={styles.item}>
      {itemHasChildren ? (
        <>
          <button
            id={ids.button}
            type="button"
            aria-controls={ids.panel}
            aria-expanded={isOpen}
            className={styles.link}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span>{item.label}</span>
            <svg
              className="icon"
              width="0.75em"
              height="0.75em"
              fill="currentColor"
              aria-hidden="true"
            >
              <use xlinkHref={`/icons/icons.svg#${isOpen ? 'caret-down' : 'caret-right'}`} />
            </svg>
          </button>

          {isOpen ? (
            <ul
              id={ids.panel}
              aria-labelledby={ids.button}
              className={styles.panel}
            >
              {itemHasHref ? (
                <li className={styles.subitem}>
                  <a
                    href={item.href}
                    className={styles.sublink}
                  >
                    {item.label}
                  </a>
                </li>
              ) : null}

              {item?.items?.map((child) => (
                <MobileNavigationItem
                  key={child.id}
                  item={child}
                />
              ))}
            </ul>
          ) : null}
        </>
      ) : itemHasHref ? (
        <a
          href={item.href}
          className={styles.link}
        >
          {item.label}
        </a>
      ) : (
        <span className={styles.link}>{item.label}</span>
      )}
    </li>
  );
}

import { NavPanelLinkItem } from '@/components/Navigation/types';

import styles from '@/components/Breadcrumb/Breadcrumb.module.css';

export type BreadcrumbProps = {
  items: NavPanelLinkItem[];
};

export function Breadcrumb({ items }: Readonly<BreadcrumbProps>) {
  if (!items || items?.length === 0) return;
  return (
    <nav
      aria-label="Breadcrumb"
      className={styles.root}
    >
      <ol className={styles.list}>
        {items?.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li
              key={item.id}
              className={styles.listItem}
            >
              {isCurrent ? (
                <span
                  className={styles.item}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  className={styles.item}
                  href={item.href}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

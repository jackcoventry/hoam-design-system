import { clsx } from 'clsx';

import { NavPanelLinkItem } from '@/components/Navigation/types';

import styles from '@/components/Breadcrumb/Breadcrumb.module.css';
import utils from '@/components/Common/Util.module.css';

export type BreadcrumbProps = {
  items: NavPanelLinkItem[];
};

export function Breadcrumb({ items }: Readonly<BreadcrumbProps>) {
  if (!items || items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className={styles.root}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === lastIndex;

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
                  className={clsx(styles.item, utils.focus)}
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

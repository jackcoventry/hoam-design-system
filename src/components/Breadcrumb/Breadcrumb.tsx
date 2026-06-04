import clsx from 'clsx';

import { NavPanelLinkItem } from '@/components/Navigation/types';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Breadcrumb/Breadcrumb.module.css';

export type BreadcrumbProps = {
  /** Ordered breadcrumb items from root to current page. */
  items: NavPanelLinkItem[];
  /** Accessible label for the breadcrumb navigation landmark. */
  'aria-label'?: string | undefined;
  /** Optional class applied to the breadcrumb navigation root. */
  className?: string;
};

export function Breadcrumb({
  items,
  'aria-label': ariaLabel,
  className,
}: Readonly<BreadcrumbProps>) {
  const t = useMessages('breadcrumb');

  if (!items || items.length === 0) return null;

  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label={ariaLabel ?? t.navigationLabel}
      className={clsx(styles.root, className)}
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

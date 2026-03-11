import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import type { NavTopLevelItem } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

export type TopNavigationItemProps = {
  item: NavTopLevelItem;
  isOpen: boolean;
  hasPanel: boolean;
  onFocusOpen: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  children?: React.ReactNode;
};

export function TopNavigationItem({
  item,
  isOpen,
  hasPanel,
  onFocusOpen,
  onHoverOpen,
  onHoverClose,
  children,
}: Readonly<TopNavigationItemProps>) {
  return (
    <li
      className={styles.item}
      onPointerEnter={() => {
        if (hasPanel) {
          onHoverOpen();
        } else {
          onHoverClose();
        }
      }}
      onFocusCapture={() => {
        if (!hasPanel) {
          onHoverClose();
        }
      }}
    >
      {hasPanel ? (
        <button
          id={topTriggerId(item.id)}
          type="button"
          data-top-trigger
          data-top-cyclable
          className={styles.link}
          aria-expanded={isOpen}
          aria-controls={panelId(item.id)}
          onFocus={onFocusOpen}
        >
          {item.label}
        </button>
      ) : (
        <a
          id={topTriggerId(item.id)}
          data-top-trigger
          data-top-cyclable
          className={styles.link}
          href={item.href}
        >
          {item.label}
        </a>
      )}

      {children}
    </li>
  );
}

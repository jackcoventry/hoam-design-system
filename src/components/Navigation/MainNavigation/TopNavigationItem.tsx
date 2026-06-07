import { panelId, topTriggerId } from '@/components/Navigation/helpers';
import type { TopNavigationItemProps } from '@/components/Navigation/types';
import { TOP_ARROW_FOCUS_ATTR } from '@/hooks/useKeyboardNav';

import styles from '@/components/Navigation/Navigation.module.css';

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
          onFocus={(event) => {
            const wasArrowFocus = event.currentTarget.getAttribute(TOP_ARROW_FOCUS_ATTR) === 'true';
            event.currentTarget.removeAttribute(TOP_ARROW_FOCUS_ATTR);

            if (!wasArrowFocus) {
              onFocusOpen();
            }
          }}
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

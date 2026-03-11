import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import type { NavGroupItem } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

export type CategoryGroupProps = {
  subitem: NavGroupItem;
  open: boolean;
  onHoverOpen: () => void;
  onFocusOpen: () => void;
  children?: React.ReactNode;
};

export function CategoryGroup({
  subitem,
  open,
  onHoverOpen,
  onFocusOpen,
  children,
}: Readonly<CategoryGroupProps>) {
  const btnId = groupBtnId(subitem.id);
  const hasChildren = Boolean(children);

  return (
    <div
      className={styles.group}
      onPointerEnter={onHoverOpen}
    >
      {hasChildren ? (
        <>
          <button
            id={btnId}
            type="button"
            data-sub-trigger
            aria-expanded={open}
            aria-controls={groupPanelId(subitem.id)}
            onFocus={onFocusOpen}
            className={styles.groupTopLink}
          >
            {subitem.label}

            <svg
              className="icon"
              width="0.75em"
              height="0.75em"
              fill="currentColor"
              aria-hidden="true"
            >
              <use xlinkHref={`/icons/icons.svg#${open ? 'caret-down' : 'caret-right'}`} />
            </svg>
          </button>

          {children}
        </>
      ) : (
        <a
          href={subitem.href}
          className={styles.groupTopLink}
          data-sub-trigger
        >
          {subitem.label}
        </a>
      )}
    </div>
  );
}

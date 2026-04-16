import { Icon } from '@/components/Icon';
import { groupBtnId, groupPanelId } from '@/components/Navigation/helpers';
import { CategoryGroupProps } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

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

            <Icon
              size="0.75em"
              id={open ? 'caret-down' : 'caret-right'}
            />
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

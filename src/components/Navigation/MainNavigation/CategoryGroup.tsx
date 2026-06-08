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
  const panelId = groupPanelId(subitem.id);
  const hasChildren = Boolean(children);
  const hasHref = typeof subitem.href === 'string' && subitem.href.length > 0;

  return (
    <div
      className={styles.group}
      onPointerEnter={onHoverOpen}
    >
      {hasChildren && hasHref ? (
        <>
          <a
            id={btnId}
            data-sub-trigger
            onFocus={onFocusOpen}
            className={styles.groupTopLink}
            href={subitem.href}
            aria-controls={panelId}
            aria-expanded={open}
          >
            {subitem.label}

            <Icon
              size="0.75em"
              id={open ? 'caret-down' : 'caret-right'}
            />
          </a>

          {children}
        </>
      ) : hasChildren ? (
        <>
          <button
            id={btnId}
            type="button"
            data-sub-trigger
            onFocus={onFocusOpen}
            className={styles.groupTopLink}
            aria-controls={panelId}
            aria-expanded={open}
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

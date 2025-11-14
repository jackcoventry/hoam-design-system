import { groupBtnId, groupPanelId } from '@/components/Navigation/Navigation.types';
import React from 'react';

type CategoryGroupProps = {
  subitem: { id: string; label: string; href?: string; items?: any[] };
  open: boolean;
  onHoverOpen: () => void;
  onFocusOpen: () => void;
  children?: React.ReactNode;
};

function CategoryGroup({
  subitem,
  open,
  onHoverOpen,
  onFocusOpen,
  children,
}: Readonly<CategoryGroupProps>) {
  const btnId = groupBtnId(subitem.id);
  return (
    <div
      className="hoam-navigation__group"
      onPointerEnter={onHoverOpen}
    >
      {children ? (
        <>
          <button
            id={btnId}
            data-sub-trigger
            aria-expanded={open}
            aria-controls={groupPanelId(subitem.id)}
            onFocus={onFocusOpen}
            className="hoam-navigation__group-top-link"
          >
            {subitem.label}

            {children ? (
              <svg
                className="icon"
                width="0.75em"
                height="0.75em"
                fill="currentColor"
              >
                <use xlinkHref={`/icons/icons.svg#${open ? 'caret-down' : 'caret-right'}`} />
              </svg>
            ) : null}
          </button>
          {children}
        </>
      ) : (
        <a
          href={subitem.href}
          className="hoam-navigation__group-top-link"
          data-sub-trigger
        >
          {subitem.label}
        </a>
      )}
    </div>
  );
}

export default CategoryGroup;

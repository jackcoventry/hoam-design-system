import { groupBtnId, groupPanelId } from '@/components/Navigation/Navigation.types';
import React from 'react';

type CategoryGroupProps = {
  subitem: { id: string; label: string; href?: string; items?: any[] };
  open: boolean;
  onHoverOpen: () => void;
  onFocusOpen: () => void;
  onClickToggle: () => void;
  children?: React.ReactNode;
};

function CategoryGroup({
  subitem,
  open,
  onHoverOpen,
  onFocusOpen,
  onClickToggle,
  children,
}: Readonly<CategoryGroupProps>) {
  const btnId = groupBtnId(subitem.id);
  return (
    <div
      className="hoam-navigation__group"
      onPointerEnter={onHoverOpen}
    >
      <button
        id={btnId}
        data-sub-trigger
        aria-expanded={open}
        aria-controls={groupPanelId(subitem.id)}
        onFocus={onFocusOpen}
        onClick={onClickToggle}
      >
        {subitem.label}
      </button>

      {subitem.href && (
        <a
          href={subitem.href}
          data-sub-link
        >
          View all {subitem.label}
        </a>
      )}

      {children}
    </div>
  );
}

export default CategoryGroup;

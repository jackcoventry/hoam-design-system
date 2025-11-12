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
      <button
        id={btnId}
        data-sub-trigger
        aria-expanded={open}
        aria-controls={groupPanelId(subitem.id)}
        onFocus={onFocusOpen}
      >
        {subitem.label}
      </button>
      {children}
    </div>
  );
}

export default CategoryGroup;

import { panelId, topTriggerId } from '@/components/Navigation/Navigation.types';

type TopNavigationItemProps = {
  item: { id: string; label: string; href: string; items?: any[] };
  isOpen: boolean;
  hasPanel: boolean;
  onFocusOpen: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  children?: React.ReactNode;
};

function TopNavigationItem({
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
      className="hoam-navigation__item"
      onPointerEnter={() => {
        if (hasPanel) {
          onHoverOpen();
        } else {
          onHoverClose();
        }
      }}
      onFocusCapture={() => {
        if (!hasPanel) onHoverClose();
      }}
    >
      {hasPanel ? (
        <button
          id={topTriggerId(item.id)}
          data-top-trigger
          data-top-cyclable
          className="hoam-navigation__link"
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
          className="hoam-navigation__link"
          href={item.href}
        >
          {item.label}
        </a>
      )}
      {children}
    </li>
  );
}

export default TopNavigationItem;

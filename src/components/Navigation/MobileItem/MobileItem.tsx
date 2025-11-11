import React from 'react';
import './MobileItem.css';

type MobileItemProps = {
  item: {
    id: string;
    label: string;
    href: string;
    items?: MobileItemProps['item'][];
  };
};

function MobileItem({ item }: Readonly<MobileItemProps>) {
  const idPrefix = 'hoam-mobile-navigation';
  const buttonId = (id: string) => `${idPrefix}-button-${id}`;
  const panelId = (id: string) => `${idPrefix}-panel-${id}`;

  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <li className="hoam-mobile-navigation__item">
      {item?.items?.length > 0 ? (
        <button
          aria-controls={panelId(item.id)}
          aria-expanded={open ? 'true' : 'false'}
          className="hoam-mobile-navigation__link"
          onClick={() => setOpen(!open)}
        >
          {item.label}{' '}
          <svg
            className="icon"
            width="0.75em"
            height="0.75em"
            fill="currentColor"
          >
            <use xlinkHref={`/icons/icons.svg#${open ? 'caret-down' : 'caret-right'}`} />
          </svg>
        </button>
      ) : (
        <a
          href={item.href}
          className="hoam-mobile-navigation__link"
        >
          {item.label}
        </a>
      )}

      {item.items && open ? (
        <ul
          id={panelId(item.id)}
          aria-labelledby={buttonId(item.id)}
          className="hoam-mobile-navigation__panel"
        >
          {/* Always include parent item link as first subitem */}
          <li className="hoam-mobile-navigation__subitem">
            <a
              href={item.href}
              className="hoam-mobile-navigation__sublink"
            >
              {item.label}
            </a>
          </li>

          {item.items.map((subItem) => (
            <li
              key={subItem.id}
              className="hoam-mobile-navigation__subitem"
            >
              <a
                href={subItem.href}
                className="hoam-mobile-navigation__sublink"
              >
                {subItem.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default MobileItem;

import { NavPanelLinkItem } from '@/components/Navigation/types/Navigation.types';

import './Breadcrumb.css';

type BreadcrumbProps = {
  items: NavPanelLinkItem[];
};

function Breadcrumb({ items }: Readonly<BreadcrumbProps>) {
  if (!items || items?.length === 0) return;
  return (
    <nav
      aria-label="Breadcrumb"
      className="hoam-breadcrumb"
    >
      <ol className="hoam-breadcrumb__list">
        {items?.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li
              key={item.id}
              className="hoam-breadcrumb__list-item"
            >
              {isCurrent ? (
                <span
                  className="hoam-breadcrumb__item"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  className="hoam-breadcrumb__item"
                  href={item.href}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

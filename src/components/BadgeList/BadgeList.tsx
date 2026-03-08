import { Children, isValidElement, PropsWithChildren, ReactElement, ReactNode } from 'react';
import './BadgeList.css';

export type BadgeListItemProps = {
  href?: string;
  theme?: 'default' | 'alert';
};

export function BadgeListItem({
  children,
  href,
  theme = 'default',
}: PropsWithChildren<BadgeListItemProps>) {
  if (!children) return;

  const Tag = href ? 'a' : 'span';
  return (
    <Tag
      className="hoam-badge-list__item"
      {...(href ? { href } : {})}
      data-theme={theme}
    >
      {children}
    </Tag>
  );
}

function isBadgeListItemElement(child: ReactNode): child is ReactElement<BadgeListItemProps> {
  return isValidElement(child) && child.type === BadgeListItem;
}

export function BadgeList({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="hoam-badge-list">
      {Children.map(children, (child) => {
        if (isBadgeListItemElement(child)) {
          return child;
        } else {
          console.error('BadgeList component only accepts child of type BadgeListItem');
        }
      })}
    </div>
  );
}

import './BadgeList.css';

type BadgeListItemProps = {
  children: React.ReactNode;
  theme?: 'default' | 'alert';
  href?: string;
};

function BadgeListItem({ children, theme = 'default', href }: Readonly<BadgeListItemProps>) {
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

function BadgeList({ children }) {
  return (
    <div className="hoam-badge-list">
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child as React.ReactElement<any>).type === BadgeListItem
        ) {
          return child;
        } else {
          console.error('BadgeList component only accepts child of type BadgeListItem');
        }
      })}
    </div>
  );
}

export default BadgeList;
export { BadgeListItem };

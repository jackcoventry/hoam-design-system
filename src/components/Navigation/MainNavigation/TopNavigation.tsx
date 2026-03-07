type TopNavigationProps = {
  children: React.ReactNode;
};

function TopNavigation({ children }: Readonly<TopNavigationProps>) {
  return (
    <nav aria-label="Main navigation">
      <ul className="hoam-navigation__list">{children}</ul>
    </nav>
  );
}

export default TopNavigation;

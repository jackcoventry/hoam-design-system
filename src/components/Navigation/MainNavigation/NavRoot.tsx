type NavRootProps = {
  innerRef: React.RefObject<HTMLElement>;
  onLeave: () => void;
  onEnter: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
  children: React.ReactNode;
};

function NavRoot({ innerRef, onLeave, onEnter, onKeyDown, children }: Readonly<NavRootProps>) {
  return (
    <header
      ref={innerRef}
      onPointerLeave={onLeave}
      onPointerEnter={onEnter}
      onKeyDown={onKeyDown}
      role="none"
    >
      <div className="hoam-navigation">{children}</div>
    </header>
  );
}

export default NavRoot;

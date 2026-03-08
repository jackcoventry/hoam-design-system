import type { FocusEventHandler, PointerEventHandler } from 'react';

type DesktopNavigationLogoProps = {
  logoSrc: string;
  onResetNavigation: () => void;
};

export default function DesktopNavigationLogo({
  logoSrc,
  onResetNavigation,
}: Readonly<DesktopNavigationLogoProps>) {
  const handleFocus: FocusEventHandler<HTMLAnchorElement> = () => {
    onResetNavigation();
  };

  const handlePointerEnter: PointerEventHandler<HTMLAnchorElement> = () => {
    onResetNavigation();
  };

  return (
    <a
      href="/"
      className="hoam-navigation__logo"
      data-top-cyclable
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
    >
      <img
        src={logoSrc}
        alt="Hoam Logo"
      />
    </a>
  );
}

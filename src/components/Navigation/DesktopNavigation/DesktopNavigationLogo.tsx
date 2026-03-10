import styles from '@/components/Navigation/Navigation.module.css';
import type { FocusEventHandler, PointerEventHandler } from 'react';

type DesktopNavigationLogoProps = {
  logoSrc: string;
  onResetNavigation: () => void;
};

export function DesktopNavigationLogo({
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
      className={styles.logo}
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

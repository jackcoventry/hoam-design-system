import type { FocusEventHandler, PointerEventHandler } from 'react';

import styles from '@/components/Navigation/Navigation.module.css';

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
      HOAM
    </a>
  );
}

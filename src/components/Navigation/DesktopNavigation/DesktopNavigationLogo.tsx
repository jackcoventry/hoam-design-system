import type { FocusEventHandler, PointerEventHandler } from 'react';

import { SITE } from '@/constants/site';

import styles from '@/components/Navigation/Navigation.module.css';

type DesktopNavigationLogoProps = {
  onResetNavigation: () => void;
};

export function DesktopNavigationLogo({ onResetNavigation }: Readonly<DesktopNavigationLogoProps>) {
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
      {SITE.title}
    </a>
  );
}

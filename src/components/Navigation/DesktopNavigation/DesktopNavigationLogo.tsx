import type { FocusEventHandler, PointerEventHandler } from 'react';

import { DesktopNavigationLogoProps } from '@/components/Navigation/types';

import styles from '@/components/Navigation/Navigation.module.css';

export function DesktopNavigationLogo({
  onResetNavigation,
  brandLabel,
  homeHref,
}: Readonly<DesktopNavigationLogoProps>) {
  const handleFocus: FocusEventHandler<HTMLAnchorElement> = () => {
    onResetNavigation();
  };

  const handlePointerEnter: PointerEventHandler<HTMLAnchorElement> = () => {
    onResetNavigation();
  };

  return (
    <a
      href={homeHref}
      className={styles.logo}
      data-top-cyclable
      onFocus={handleFocus}
      onPointerEnter={handlePointerEnter}
    >
      {brandLabel}
    </a>
  );
}

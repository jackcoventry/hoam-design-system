import type { CSSProperties, PropsWithChildren } from 'react';

export type PageShellProps = PropsWithChildren<{
  navHeight?: string;
  navIsFixed?: boolean;
  notificationHeight?: string;
  showNotificationBar?: boolean;
}>;

export type PageShellVars = CSSProperties & {
  '--notification-height'?: string;
  '--nav-height'?: string;
  '--hero-offset'?: string;
};

export function PageShell({
  children,
  showNotificationBar = false,
  navIsFixed = false,
  notificationHeight = '45px',
  navHeight = '80px',
}: Readonly<PageShellProps>) {
  const resolvedNotificationHeight = showNotificationBar ? notificationHeight : '0px';
  const resolvedNavHeight = navIsFixed ? '0px' : navHeight;

  const style: PageShellVars = {
    '--notification-height': resolvedNotificationHeight,
    '--nav-height': resolvedNavHeight,
    '--hero-offset': `calc(${resolvedNotificationHeight} + ${resolvedNavHeight})`,
  };

  return <div style={style}>{children}</div>;
}

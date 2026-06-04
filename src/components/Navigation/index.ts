/** Shared navigation data and component prop types. */
export type {
  CategoryGroupProps,
  DesktopNavigationActionsProps,
  DesktopNavigationItemsProps,
  DesktopNavigationLogoProps,
  NavBranchItem,
  NavGroupItem,
  NavigationLayout,
  NavigationProps,
  NavigationUserItems,
  NavLeafItem,
  NavListGroupItem,
  NavPanelItem,
  NavPanelLinkItem,
  NavThumbnailGroupItem,
  NavThumbnailItem,
  NavTopLevelItem,
  NavTreeItem,
  NavUserAction,
  NavUserItem,
  PanelProps,
  PromoBlockProps,
  ThirdLevelItemsProps,
  TopNavigationItemProps,
  UserAction,
  UserItem,
} from '@/components/Navigation/types';
/** Desktop navigation shell props. */
export type { DesktopNavigationProps } from '@/components/Navigation/DesktopNavigation/DesktopNavigation';
/** Desktop navigation shell for large viewports. */
export { DesktopNavigation } from '@/components/Navigation/DesktopNavigation/DesktopNavigation';
/** Action cluster for desktop navigation utilities. */
export { DesktopNavigationActions } from '@/components/Navigation/DesktopNavigation/DesktopNavigationActions';
/** Top-level desktop navigation items and panels. */
export { DesktopNavigationItems } from '@/components/Navigation/DesktopNavigation/DesktopNavigationItems';
/** Brand logo link for desktop navigation. */
export { DesktopNavigationLogo } from '@/components/Navigation/DesktopNavigation/DesktopNavigationLogo';
/** Promotional content block for flyout navigation panels. */
export { PromoBlock } from '@/components/Navigation/MainNavigation/PromoBlock/PromoBlock';
/** Grouped navigation category within flyout panels. */
export { CategoryGroup } from '@/components/Navigation/MainNavigation/CategoryGroup';
/** Root wrapper for navigation panel content. */
export type { NavRootProps } from '@/components/Navigation/MainNavigation/NavRoot';
export { NavRoot } from '@/components/Navigation/MainNavigation/NavRoot';
/** Accessible flyout panel container. */
export { Panel } from '@/components/Navigation/MainNavigation/Panel';
/** Third-level navigation list for nested groups. */
export { ThirdLevelItems } from '@/components/Navigation/MainNavigation/ThirdLevelItems';
/** Horizontal list wrapper for top navigation items. */
export type { TopNavigationProps } from '@/components/Navigation/MainNavigation/TopNavigation';
export { TopNavigation } from '@/components/Navigation/MainNavigation/TopNavigation';
/** Individual trigger for a top-level navigation item. */
export { TopNavigationItem } from '@/components/Navigation/MainNavigation/TopNavigationItem';
/** Mobile navigation shell for smaller viewports. */
export type { MobileNavigationProps } from '@/components/Navigation/MobileNavigation/MobileNavigation';
export { MobileNavigation } from '@/components/Navigation/MobileNavigation/MobileNavigation';
/** Recursive mobile navigation item renderer. */
export type { MobileNavigationItemProps } from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
export { MobileNavigationItem } from '@/components/Navigation/MobileNavigation/MobileNavigationItem';
/** Basket modal wired for use with the navigation system. */
export type { BasketModalProps } from '@/components/Navigation/Modals/BasketModal';
export { BasketModal } from '@/components/Navigation/Modals/BasketModal';
/** Search modal wired for use with the navigation system. */
export type { SearchModalProps } from '@/components/Navigation/Modals/SearchModal';
export { SearchModal } from '@/components/Navigation/Modals/SearchModal';
/** Responsive site navigation combining desktop, mobile, search, and basket flows. */
export { Navigation } from '@/components/Navigation/Navigation';

export type NavigationLayout = 'list' | 'thumbnail';
export type NavigationVariant = 'default' | 'fixed' | 'sticky';
export type NavUserAction = 'USER_SEARCH' | 'USER_BASKET';

export interface NavLeafItem {
  id: string;
  label: string;
  href: string;
  description?: string;
}

export interface NavBranchItem {
  id: string;
  label: string;
  href?: string;
  items: NavLeafItem[];
}

export interface NavThumbnailItem {
  id: string;
  label: string;
  href: string;
  thumbnail: string;
}

export interface NavListGroupItem {
  id: string;
  label: string;
  href?: string;
  layout: 'list';
  items: NavBranchItem[];
}

export interface NavThumbnailGroupItem {
  id: string;
  label: string;
  href?: string;
  layout: 'thumbnail';
  items: NavThumbnailItem[];
}

export type NavGroupItem = NavListGroupItem | NavThumbnailGroupItem;

export interface NavPanelLinkItem {
  id: string;
  label: string;
  href: string;
}

export type NavPanelItem = NavPanelLinkItem | NavGroupItem;

export interface NavTopLevelItem {
  id: string;
  label: string;
  href?: string;
  thumbnail?: string;
  items?: NavPanelItem[];
}

export interface NavUserItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  title?: string;
  action?: NavUserAction;
}

export type NavTreeItem =
  | NavTopLevelItem
  | NavPanelItem
  | NavBranchItem
  | NavLeafItem
  | NavThumbnailItem;

export interface NavigationProps {
  items?: NavTopLevelItem[];
  userItems?: NavUserItem[];
  variant?: NavigationVariant;
  basketEndpoint: string;
  searchEndpoint: string;
}

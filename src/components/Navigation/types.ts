export type NavigationLayout = 'list' | 'thumbnail';
export type NavUserAction = 'USER_SEARCH' | 'USER_BASKET';

export interface NavLeafItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  thumbnail?: string;
}

export interface NavBranchItem {
  id: string;
  label: string;
  href?: string;
  items: NavLeafItem[];
}

export interface NavGroupItem {
  id: string;
  label: string;
  href?: string;
  layout: NavigationLayout;
  items: NavBranchItem[];
}

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
  title?: string | undefined;
  action?: NavUserAction | undefined;
}

export type NavTreeItem = NavTopLevelItem | NavPanelItem | NavBranchItem | NavLeafItem;

export interface NavigationProps {
  items?: NavTopLevelItem[];
  userItems?: NavUserItem[];
  variant?: 'default' | 'fixed';
}

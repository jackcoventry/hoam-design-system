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

export type UserItem = NonNullable<NavigationProps['userItems']>[number];
export type UserAction = NonNullable<UserItem['action']>;

export type DesktopNavigationActionsProps = {
  userItems: NavigationProps['userItems'];
  onResetNavigation: () => void;
  onOpenSearch: () => void;
  onOpenBasket: () => void;
};

export type DesktopNavigationItemsProps = {
  items: NavTopLevelItem[];
  openIndex: number | null;
  openGroupId: string | null;
  setOpenGroupId: (id: string | null) => void;
  handleTopNavigationOpen: (index: number) => void;
  clearLeave: () => void;
  onOpenFirstCategory: (topIndex: number) => void;
  onResetNavigation: () => void;
};

export type DesktopNavigationLogoProps = {
  onResetNavigation: () => void;
};

export type CategoryGroupProps = {
  subitem: NavGroupItem;
  open: boolean;
  onHoverOpen: () => void;
  onFocusOpen: () => void;
  children?: React.ReactNode;
};

export type PanelProps = {
  id: string;
  labelledBy: string;
  hidden: boolean;
  onEnter: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

export type PromoBlockProps = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export type ThirdLevelItemsProps = {
  group: NavGroupItem;
  open: boolean;
};

export type TopNavigationItemProps = {
  item: NavTopLevelItem;
  isOpen: boolean;
  hasPanel: boolean;
  onFocusOpen: () => void;
  onHoverOpen: () => void;
  onHoverClose: () => void;
  children?: React.ReactNode;
};

import { SubmitHandler } from 'react-hook-form';

import { BasketItemProps } from '@/components/Basket';
import type { SearchFormSchemaType } from '@/components/Form';

export type NavigationLayout = 'list' | 'thumbnail';
export type NavUserAction = 'USER_SEARCH' | 'USER_BASKET';
export type NavigationUserItems = NavUserItem[];

export interface NavLeafItem {
  /** Stable identifier for the navigation item. */
  id: string;
  /** Visible link label. */
  label: string;
  /** Link destination. */
  href: string;
  /** Optional supporting text for richer menus. */
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
  /** Stable identifier for the top-level navigation item. */
  id: string;
  /** Visible label shown in the top navigation. */
  label: string;
  /** Optional direct destination when the item is also a link. */
  href?: string;
  /** Optional promo image rendered in the desktop flyout. */
  thumbnail?: string;
  /** Optional panel content rendered when the item is expanded. */
  items?: NavPanelItem[];
}

export interface NavUserItem {
  /** Stable identifier for the user action item. */
  id: string;
  /** Visible label used for the action. */
  label: string;
  /** Destination for link-based user items. */
  href: string;
  /** Icon token id rendered for the action. */
  icon: string;
  /** Optional longer label used in some navigation layouts. */
  title?: string;
  /** Optional built-in behavior for search and basket actions. */
  action?: NavUserAction;
  /** Optional numeric badge count shown for the action. */
  count?: number;
}

export type NavTreeItem =
  | NavTopLevelItem
  | NavPanelItem
  | NavBranchItem
  | NavLeafItem
  | NavThumbnailItem;

export interface NavigationProps {
  /** Primary navigation tree rendered in both desktop and mobile navigation. */
  items?: NavTopLevelItem[];
  /** Secondary user-action items such as account, search, and basket. */
  userItems?: NavUserItem[];
  /** Accessible label for the brand or home link. */
  brandLabel?: string;
  /** Destination used for the brand or home link. */
  homeHref?: string;
  /** Search form submit handler used by the built-in search modal. */
  searchSubmit: SubmitHandler<SearchFormSchemaType>;
  /** Basket items rendered inside the built-in basket modal. */
  basketData: BasketItemProps[];
}

export type UserItem = NavigationUserItems[number];
export type UserAction = NonNullable<UserItem['action']>;

export type DesktopNavigationActionsProps = {
  userItems: NavigationUserItems | undefined;
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
  brandLabel: string;
  homeHref: string;
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
  href?: string;
  image?: string;
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

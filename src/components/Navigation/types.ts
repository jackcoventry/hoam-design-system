import { SubmitHandler } from 'react-hook-form';

import { BasketItemProps } from '@/components/Basket';
import type { SearchFormResult, SearchFormSchemaType } from '@/components/Form';
import { AsyncState } from '@/types/async';

export type NavigationLayout = 'list' | 'thumbnail';
export type NavUserAction = 'USER_SEARCH' | 'USER_BASKET';
export type NavigationUserItems = NavUserItem[];

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

export interface NavigationProps<TData, TError extends Error = Error> {
  items?: NavTopLevelItem[];
  userItems?: NavUserItem[];
  brandLabel?: string;
  homeHref?: string;
  searchSubmit: SubmitHandler<SearchFormSchemaType>;
  searchData: SearchFormResult[] | null;
  searchState: AsyncState<TData, TError>;
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

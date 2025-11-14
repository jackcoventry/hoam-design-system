export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon?: string;
  items?: NavItem[];
  thumbnail?: string;
};

export type NavGroupItem = NavItem & {
  layout: 'list' | 'thumbnail';
};

export type NavigationProps = {
  items: NavItem[];
  userItems: NavItem[];
};

export const topTriggerId = (id: string) => `trigger-${id}`;
export const panelId = (id: string) => `panel-${id}`;
export const groupBtnId = (id: string) => `group-${id}`;
export const groupPanelId = (id: string) => `group-${id}-panel`;

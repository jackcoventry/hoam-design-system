import React from 'react';
import './Navigation.css';

export type NavItem = {
  id: string;
  label: string;
  href: string;
  panel?: React.ReactNode;
};

export type NavigationProps = {
  items: NavItem[];
};

function Navigation({ items }: Readonly<NavigationProps>) {
  const idPrefix = 'hoam-nav';
  const panelId = (id: string) => `${idPrefix}-panel-${id}`;
  const buttonId = (id: string) => `${idPrefix}-button-${id}`;

  return <header className="hoam-navigation"></header>;
}

export default Navigation;

import type { NavItem } from '@/components/Navigation/Navigation.types';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders nothing when items is an empty array', () => {
    const { container } = render(<Breadcrumb items={[]} />);

    expect(screen.queryByRole('navigation', { name: /Breadcrumb/i })).not.toBeInTheDocument();

    expect(container.firstChild).toBeNull();
  });

  it('renders a navigation landmark with aria-label "Breadcrumb"', () => {
    const items: NavItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'coffee', label: 'Coffee', href: '/products/coffee' },
    ];

    render(<Breadcrumb items={items} />);

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('hoam-breadcrumb');
  });

  it('renders all items as list items inside an ordered list', () => {
    const items: NavItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'coffee', label: 'Coffee', href: '/products/coffee' },
    ];

    render(<Breadcrumb items={items} />);

    const list = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');

    expect(list).toHaveClass('hoam-breadcrumb__list');
    expect(listItems).toHaveLength(items.length);
    listItems.forEach((li) => expect(li).toHaveClass('hoam-breadcrumb__list-item'));
  });

  it('renders all but the last item as links and the last item as a span with aria-current="page"', () => {
    const items: NavItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'products', label: 'Products', href: '/products' },
      { id: 'coffee', label: 'Coffee', href: '/products/coffee' },
    ];

    render(<Breadcrumb items={items} />);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const productsLink = screen.getByRole('link', { name: 'Products' });

    expect(homeLink).toHaveClass('hoam-breadcrumb__item');
    expect(homeLink).toHaveAttribute('href', '/');

    expect(productsLink).toHaveClass('hoam-breadcrumb__item');
    expect(productsLink).toHaveAttribute('href', '/products');

    // Current / last item should not be a link
    const current = screen.getByText('Coffee');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveClass('hoam-breadcrumb__item');
    expect(current).toHaveAttribute('aria-current', 'page');
  });
});

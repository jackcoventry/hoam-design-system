import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SectionHeader } from '@/components/SectionHeader/SectionHeader';

vi.mock('@/components/SectionHeader/SectionHeader.module.css', () => ({
  default: {
    root: 'root',
    slot: 'slot',
  },
}));

vi.mock('@/styles/Typography.module.css', () => ({
  default: {
    heading: 'heading',
  },
}));

vi.mock('@/styles/Util.module.css', () => ({
  default: {
    justifyBetween: 'justifyBetween',
  },
}));

describe('SectionHeader', () => {
  it('renders the title as a level two heading', () => {
    render(<SectionHeader title="Featured products" />);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Featured products',
    });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('heading');
  });

  it('renders interactive children in the action slot', () => {
    render(
      <SectionHeader title="Featured products">
        <a href="/shop/featured">View all</a>
      </SectionHeader>
    );

    const link = screen.getByRole('link', { name: 'View all' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/shop/featured');
    expect(link.parentElement).toHaveClass('slot');
  });

  it('keeps the heading and slot inside the layout root', () => {
    const { container } = render(
      <SectionHeader title="New arrivals">
        <button type="button">Filter</button>
      </SectionHeader>
    );

    const root = container.firstElementChild;

    expect(root).toHaveClass('root');
    expect(root).toHaveClass('justifyBetween');
    expect(root).toContainElement(screen.getByRole('heading', { name: 'New arrivals' }));
    expect(root).toContainElement(screen.getByRole('button', { name: 'Filter' }));
  });

  it('renders an empty slot when no children are provided', () => {
    const { container } = render(<SectionHeader title="Coffee picks" />);

    const slot = container.querySelector('.slot');

    expect(slot).toBeInTheDocument();
    expect(slot).toBeEmptyDOMElement();
  });
});

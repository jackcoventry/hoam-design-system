import { render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Pagination } from '@/components/Pagination/Pagination';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    variant,
    icon,
    iconOnly,
  }: {
    children?: ReactNode;
    variant?: string;
    icon?: string;
    iconOnly?: boolean;
  } & ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      data-variant={variant}
      data-icon={icon}
      data-icon-only={iconOnly ? 'true' : 'false'}
    >
      {children}
    </button>
  ),
}));

describe('Pagination', () => {
  it('renders default pagination (6 pages, page 1 active)', () => {
    render(<Pagination />);

    // Page numbers
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();

    // Prev / Next
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('renders the correct number of page buttons', () => {
    render(<Pagination pageCount={3} />);

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument();
  });

  it('applies primary variant to the current page', () => {
    render(
      <Pagination
        pageCount={5}
        currentPage={3}
      />
    );

    const active = screen.getByRole('button', { name: '3' });
    expect(active).toHaveAttribute('data-variant', 'primary');
  });

  it('applies secondary variant to non-active pages', () => {
    render(
      <Pagination
        pageCount={3}
        currentPage={2}
      />
    );

    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('data-variant', 'secondary');
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('data-variant', 'secondary');
  });

  it('renders previous and next buttons with icon props', () => {
    render(<Pagination />);

    const prev = screen.getByRole('button', { name: 'Previous' });
    const next = screen.getByRole('button', { name: 'Next' });

    expect(prev).toHaveAttribute('data-icon', 'arrow-left');
    expect(prev).toHaveAttribute('data-icon-only', 'true');

    expect(next).toHaveAttribute('data-icon', 'arrow-right');
    expect(next).toHaveAttribute('data-icon-only', 'true');
  });

  it('handles currentPage outside range gracefully', () => {
    render(
      <Pagination
        pageCount={3}
        currentPage={10}
      />
    );

    const pages = ['1', '2', '3'].map((p) => screen.getByRole('button', { name: p }));

    pages.forEach((btn) => {
      expect(btn).toHaveAttribute('data-variant', 'secondary');
    });
  });
});

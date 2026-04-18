import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Pagination } from '@/components/Pagination/Pagination';

const mockUseMessages = vi.fn<
  (namespace: string) => {
    previous: string;
    next: string;
    title: string;
    current: string;
    goTo: string;
  }
>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    disabled,
    onClick,
    'aria-current': ariaCurrent,
    'aria-label': ariaLabel,
    icon,
    iconOnly,
    variant,
    size,
  }: {
    children: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    'aria-current'?: boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time';
    'aria-label'?: string;
    icon?: string;
    iconOnly?: boolean;
    variant?: string;
    size?: string;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-current={ariaCurrent}
      aria-label={ariaLabel}
      data-icon={icon}
      data-icon-only={iconOnly ? 'true' : 'false'}
      data-variant={variant}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Pagination/Pagination.module.css', () => ({
  default: {
    root: 'root',
    list: 'list',
    ellipsis: 'ellipsis',
    ellipsisText: 'ellipsisText',
  },
}));

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseMessages.mockReturnValue({
      previous: 'Previous page',
      next: 'Next page',
      title: 'Pagination',
      current: 'Current page',
      goTo: 'Go to page',
    });
  });

  it('renders the navigation landmark with the default aria-label', () => {
    render(<Pagination />);

    expect(mockUseMessages).toHaveBeenCalledWith('pagination');
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders the navigation landmark with a custom aria-label', () => {
    render(<Pagination aria-label="Product pagination" />);

    expect(screen.getByRole('navigation', { name: 'Product pagination' })).toBeInTheDocument();
  });

  it('renders previous and next buttons with default labels', () => {
    render(<Pagination />);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('renders previous and next buttons with custom labels', () => {
    render(
      <Pagination
        previousLabel="Go back"
        nextLabel="Go forward"
      />
    );

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go forward' })).toBeInTheDocument();
  });

  it('renders the default page range when pageCount is small enough', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Current page, 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 6' })).toBeInTheDocument();
  });

  it('marks the current page button correctly', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={3}
      />
    );

    const currentPageButton = screen.getByRole('button', { name: 'Current page, 3' });

    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    expect(currentPageButton).toBeDisabled();
    expect(currentPageButton).toHaveAttribute('data-variant', 'primary');
  });

  it('renders non-current page buttons with go-to labels', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={3}
      />
    );

    const page2Button = screen.getByRole('button', { name: 'Go to page 2' });
    expect(page2Button).not.toBeDisabled();
    expect(page2Button).toHaveAttribute('data-variant', 'secondary');
  });

  it('disables the previous button on the first page', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={6}
      />
    );

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('calls onPageChange with the clicked page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 5' }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('does not call onPageChange when clicking the current page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Current page, 3' }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('calls onPageChange with the previous page when previous is clicked', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with the next page when next is clicked', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={3}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not call onPageChange when previous is clicked on the first page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('does not call onPageChange when next is clicked on the last page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={6}
        currentPage={6}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders a right ellipsis when near the start of a large page range', () => {
    const { container } = render(
      <Pagination
        pageCount={10}
        currentPage={2}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Current page, 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeInTheDocument();

    const ellipses = container.querySelectorAll('.ellipsis');
    expect(ellipses).toHaveLength(1);
  });

  it('renders a left ellipsis when near the end of a large page range', () => {
    const { container } = render(
      <Pagination
        pageCount={10}
        currentPage={9}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Current page, 9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeInTheDocument();

    const ellipses = container.querySelectorAll('.ellipsis');
    expect(ellipses).toHaveLength(1);
  });

  it('renders both ellipses when in the middle of a large page range', () => {
    const { container } = render(
      <Pagination
        pageCount={10}
        currentPage={5}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Current page, 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeInTheDocument();

    const ellipses = container.querySelectorAll('.ellipsis');
    expect(ellipses).toHaveLength(2);
  });

  it('treats negative siblingCount as zero', () => {
    const { container } = render(
      <Pagination
        pageCount={10}
        currentPage={5}
        siblingCount={-1}
      />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Current page, 5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 10' })).toBeInTheDocument();

    const ellipses = container.querySelectorAll('.ellipsis');
    expect(ellipses).toHaveLength(2);
  });

  it('clamps currentPage up to 1 when it is too low', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={0}
      />
    );

    expect(screen.getByRole('button', { name: 'Current page, 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('clamps currentPage down to pageCount when it is too high', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={999}
      />
    );

    expect(screen.getByRole('button', { name: 'Current page, 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('treats pageCount less than 1 as 1', () => {
    render(
      <Pagination
        pageCount={0}
        currentPage={1}
      />
    );

    expect(screen.getByRole('button', { name: 'Current page, 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders navigation buttons with the expected icon props', () => {
    render(<Pagination />);

    const previous = screen.getByRole('button', { name: 'Previous page' });
    const next = screen.getByRole('button', { name: 'Next page' });

    expect(previous).toHaveAttribute('data-icon', 'arrow-left');
    expect(previous).toHaveAttribute('data-icon-only', 'true');
    expect(previous).toHaveAttribute('data-size', 'small');

    expect(next).toHaveAttribute('data-icon', 'arrow-right');
    expect(next).toHaveAttribute('data-icon-only', 'true');
    expect(next).toHaveAttribute('data-size', 'small');
  });

  it('renders page buttons with small size', () => {
    render(
      <Pagination
        pageCount={3}
        currentPage={2}
      />
    );

    expect(screen.getByRole('button', { name: 'Go to page 1' })).toHaveAttribute(
      'data-size',
      'small'
    );
    expect(screen.getByRole('button', { name: 'Current page, 2' })).toHaveAttribute(
      'data-size',
      'small'
    );
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toHaveAttribute(
      'data-size',
      'small'
    );
  });

  it('works without an onPageChange handler', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={3}
      />
    );

    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
      fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    }).not.toThrow();
  });
});

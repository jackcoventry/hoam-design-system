import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from '@/components/Pagination';

describe('Pagination', () => {
  it('renders a navigation landmark', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={1}
      />
    );

    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('renders all page buttons when page count is small', () => {
    render(
      <Pagination
        pageCount={6}
        currentPage={3}
      />
    );

    expect(screen.getByRole('button', { name: /go to page 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 2/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 3, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 4/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 5/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 6/i })).toBeInTheDocument();

    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('renders ellipses when page count is large', () => {
    render(
      <Pagination
        pageCount={20}
        currentPage={10}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: /go to page 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 9/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 10, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 11/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 20/i })).toBeInTheDocument();

    expect(screen.getAllByText('…')).toHaveLength(2);
  });

  it('marks the current page with aria-current', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={4}
      />
    );

    expect(screen.getByRole('button', { name: /page 4, current page/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('disables the current page button', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={4}
      />
    );

    expect(screen.getByRole('button', { name: /page 4, current page/i })).toBeDisabled();
  });

  it('calls onPageChange when clicking a non-current page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={10}
        currentPage={4}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /go to page 5/i }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('does not call onPageChange when clicking the current page', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={10}
        currentPage={4}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /page 4, current page/i }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('calls onPageChange with the previous page when clicking previous', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={10}
        currentPage={4}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange with the next page when clicking next', () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        pageCount={10}
        currentPage={4}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('disables previous on the first page', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={1}
      />
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
  });

  it('disables next on the last page', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={10}
      />
    );

    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
  });

  it('clamps currentPage below the valid range', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={0}
      />
    );

    expect(screen.getByRole('button', { name: /page 1, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('clamps currentPage above the valid range', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={999}
      />
    );

    expect(screen.getByRole('button', { name: /page 10, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('respects custom labels', () => {
    render(
      <Pagination
        pageCount={10}
        currentPage={5}
        previousLabel="Go back"
        nextLabel="Go forward"
        ariaLabel="Results pages"
      />
    );

    expect(screen.getByRole('navigation', { name: /results pages/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go forward/i })).toBeInTheDocument();
  });

  it('renders a simplified range near the start', () => {
    render(
      <Pagination
        pageCount={20}
        currentPage={2}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: /go to page 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 2, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 3/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 4/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 5/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 20/i })).toBeInTheDocument();

    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  it('renders a simplified range near the end', () => {
    render(
      <Pagination
        pageCount={20}
        currentPage={19}
        siblingCount={1}
      />
    );

    expect(screen.getByRole('button', { name: /go to page 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 16/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 17/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 18/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /page 19, current page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to page 20/i })).toBeInTheDocument();

    expect(screen.getAllByText('…')).toHaveLength(1);
  });
});

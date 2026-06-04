import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PropsWithChildren, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  SearchForm,
  type SearchFormSchemaType,
  SearchLoader,
} from '@/components/Form/SearchForm/SearchForm';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    as,
    href,
    onClick,
    type = 'button',
    disabled,
    className,
  }: PropsWithChildren<{
    as?: 'a';
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
  }>) =>
    as === 'a' ? (
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    ) : (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Layout', () => ({
  Stack: ({ children }: { children: ReactNode }) => <div data-testid="stack">{children}</div>,
}));

vi.mock('@/components/Loading', () => ({
  Spinner: () => <div data-testid="spinner">Loading…</div>,
}));

vi.mock('@/components/Pagination', () => ({
  Pagination: ({ currentPage }: { currentPage: number }) => (
    <div data-testid="pagination">Page {currentPage}</div>
  ),
}));

describe('SearchLoader', () => {
  it('renders the spinner', () => {
    render(<SearchLoader />);

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});

describe('SearchForm', () => {
  it('renders the form controls with default labels and placeholder', () => {
    const { container } = render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
        className="custom-search-form"
      />
    );

    expect(container.firstChild).toHaveClass('custom-search-form');
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter keywords...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('renders custom submit label and placeholder text', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
        submitLabel="Find"
        placeholderText="Search articles..."
      />
    );

    expect(screen.getByRole('searchbox', { name: 'Find' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Find' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();

    render(
      <SearchForm
        onClose={onClose}
        onSubmit={() => {}}
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('can hide the focus-only close button for modal compositions with their own close control', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
        showCloseButton={false}
      />
    );

    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
  });

  it('calls onSubmit with the entered query when the form is valid', async () => {
    const onSubmit = vi.fn<(data: SearchFormSchemaType) => void | Promise<void>>();

    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    fireEvent.change(input, { target: { value: 'espresso grinders' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ q: 'espresso grinders' });
  });

  it('trims the submitted value via schema validation', async () => {
    const onSubmit = vi.fn<(data: SearchFormSchemaType) => void | Promise<void>>();

    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    fireEvent.change(input, { target: { value: '  trimmed query  ' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ q: 'trimmed query' });
  });

  it('does not call onSubmit when the query is empty', async () => {
    const onSubmit = vi.fn<(data: SearchFormSchemaType) => void | Promise<void>>();

    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('shows the validation error in the placeholder and marks the field invalid', async () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
      />
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    expect(input).toHaveAttribute('data-valid', 'false');
    expect(input).toHaveAttribute('placeholder', 'Required');
  });

  it('marks the field valid before validation errors occur', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
      />
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAttribute('data-valid', 'true');
    expect(input).toHaveAttribute('placeholder', 'Enter keywords...');
  });

  it('disables the input and submit button while loading', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading
      />
    );

    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('does not disable the close button while loading', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading
      />
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).not.toBeDisabled();
  });

  it('uses the expected input id and label association', () => {
    render(
      <SearchForm
        onClose={() => {}}
        onSubmit={() => {}}
        loading={false}
      />
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    expect(input).toHaveAttribute('id', 'hoam-search-form-input');
  });
});

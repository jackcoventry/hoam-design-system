import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  SearchResult,
  type SearchResultItem,
  SearchResults,
} from '@/components/SearchResults/SearchResults';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    as,
    href,
    className,
  }: PropsWithChildren<{
    as?: 'a';
    href?: string;
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
        type="button"
        className={className}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Pagination', () => ({
  Pagination: ({ currentPage }: { currentPage: number }) => (
    <div data-testid="pagination">Page {currentPage}</div>
  ),
}));

describe('SearchResult', () => {
  it('renders the title, preview, ordinal and link', () => {
    render(
      <SearchResult
        title="Useful result"
        preview="A short preview"
        url="/result"
        index={2}
      />
    );

    expect(screen.getByText('Result 03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Useful result' })).toBeInTheDocument();
    expect(screen.getByText('A short preview')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Read more' });
    expect(link).toHaveAttribute('href', '/result');
  });
});

describe('SearchResults', () => {
  const items: SearchResultItem[] = [
    {
      id: 1,
      title: 'First result',
      url: '/first',
      preview: 'First preview',
    },
    {
      title: 'Second result',
      url: '/second',
      preview: 'Second preview',
    },
  ];

  it('renders a no results message when items is empty', () => {
    render(
      <SearchResults
        items={[]}
        className="custom-search-results"
      />
    );

    expect(screen.getByText('No results!')).toBeInTheDocument();
    expect(screen.getByText('No results!').parentElement).toHaveClass('custom-search-results');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('renders a list of results', () => {
    render(<SearchResults items={items} />);

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');

    expect(screen.getByText('2 results')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'First result' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Second result' })).toBeInTheDocument();

    expect(screen.getByText('First preview')).toBeInTheDocument();
    expect(screen.getByText('Second preview')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: 'Read more' });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/first');
    expect(links[1]).toHaveAttribute('href', '/second');
  });

  it('renders pagination when there are results', () => {
    const { container } = render(
      <SearchResults
        items={items}
        className="custom-search-results"
      />
    );

    expect(container.firstChild).toHaveClass('custom-search-results');
    expect(screen.getByTestId('pagination')).toHaveTextContent('Page 1');
  });

  it('renders one list item per result', () => {
    render(<SearchResults items={items} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
